import { api } from "./api";
import type { PaginationMeta, User, UserInput, UsersPageData } from "../types";

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

//value has to be objects, null is an object in javascript
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

//match with all user values (id,name,username,email) from backend
const isUser = (value: unknown): value is User => {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.username === "string" &&
    typeof value.email === "string"
  );
};

//change input to non-negative interger, >=0 and prevent decimals
const toNonNegativeInt = (value: unknown, fallback: number) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.trunc(parsed));
};

//change to put to a postive interger, >0 and prevent decimals
const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isFinite(parsed)) return fallback;

  const normalized = Math.trunc(parsed);
  return normalized > 0 ? normalized : fallback;
};

//make current page number is wthin valid range
const fallbackPagination = (
  page: number,
  limit: number, //items per page
  total: number, // total items in dataset
): PaginationMeta => {
  const totalPages = total === 0 ? 1 : Math.ceil(total / limit); //page 0 doesn't make sense
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return {
    page: currentPage,
    limit,
    total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

//check parse userdata from payload is valid
const parseUserFromPayload = (payload: unknown): User => {
  if (isRecord(payload) && isUser(payload.data)) {
    return payload.data;
  }

  if (isUser(payload)) {
    return payload;
  }

  throw new Error("Invalid user response payload");
};

export const getAllUsers = async (
  params: GetUsersParams = {},
): Promise<UsersPageData> => {
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const limit = Math.max(1, Math.trunc(params.limit ?? 10));
  const search = params.search?.trim();

  const response = await api.get("/", {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
  });

  const payload: unknown = response.data;

  //parse API payload into user and
  //payload has to be an object, not null, not string, not array
  if (isRecord(payload)) {
    //payload as array
    const users = Array.isArray(payload.data) ? (payload.data as User[]) : [];
    //not negative , not null
    const totalFromPayload = toNonNegativeInt(payload.total, users.length);
    //make default pagination safe with the function fallbackpagination
    let pagination = fallbackPagination(page, limit, totalFromPayload);

    //pagination exists and it is object
    if (isRecord(payload.pagination)) {
      //page is valid with postinve number
      const nextPage = toPositiveInt(payload.pagination.page, pagination.page);
      // limit 1 or more than 1
      const nextLimit = toPositiveInt(
        payload.pagination.limit,
        pagination.limit,
      );
      // not negative
      const nextTotal = toNonNegativeInt(
        payload.pagination.total,
        totalFromPayload,
      );

      const nextTotalPages =
        nextTotal === 0 ? 1 : Math.ceil(nextTotal / nextLimit);
      const totalPages = toPositiveInt(
        payload.pagination.totalPages,
        nextTotalPages,
      );
      //not current page > totalPages
      const currentPage = Math.min(nextPage, totalPages);

      pagination = {
        page: currentPage,
        limit: nextLimit,
        total: nextTotal,
        totalPages,
        hasNextPage:
          typeof payload.pagination.hasNextPage === "boolean"
            ? payload.pagination.hasNextPage
            : currentPage < totalPages,
        hasPrevPage:
          typeof payload.pagination.hasPrevPage === "boolean"
            ? payload.pagination.hasPrevPage
            : currentPage > 1,
      };
    }

    return { data: users, pagination };
  }

  //userlist as Array payload
  if (Array.isArray(payload)) {
    const users = payload as User[];
    return {
      data: users,
      pagination: fallbackPagination(page, limit, users.length),
    };
  }

  return {
    data: [],
    pagination: fallbackPagination(page, limit, 0),
  };
};

//create user data
export const createUser = async (userData: UserInput): Promise<User> => {
  const response = await api.post("/", userData);
  return parseUserFromPayload(response.data);
};

//update user data
export const updateUser = async (
  id: string,
  userData: Partial<UserInput>,
): Promise<User> => {
  const response = await api.put(`/${id}`, userData);
  return parseUserFromPayload(response.data);
};

//delete user data
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};
