import type { User } from "../types/user.js";
import { createError } from "../middleware/errorHandler.js";
import { generateId } from "../utils/generateId.js";
import { userSchema } from "../schemas/user.schema.js";
import { readUsers, writeUsers } from "../utils/fileHandler.js";

export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserData = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;

type GetUsersOptions = {
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export type UsersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedUsersResult = {
  data: User[];
  pagination: UsersPagination;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const normalizeSearchQuery = (value?: string) => value?.trim().toLowerCase() ?? "";

const matchesSearch = (user: User, query: string): boolean => {
  return [user.name, user.username, user.email].some((fieldValue) =>
    fieldValue.toLowerCase().includes(query),
  );
};

const toPositiveInt = (value: number | undefined, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  const normalized = Math.trunc(value);
  return normalized > 0 ? normalized : fallback;
};

const getUserIndexById = (users: User[], id: string): number => {
  return users.findIndex((user) => user.id === id);
};

const getExistingUserById = (users: User[], id: string): User => {
  const foundUser = users.find((user) => user.id === id);
  if (!foundUser) {
    throw createError(`User with id ${id} not found`, 404);
  }
  return foundUser;
};

const assertUniqueEmail = (users: User[], email: string, excludedUserId?: string): void => {
  const normalizedTargetEmail = normalizeEmail(email);
  const emailExists = users.some((user) => {
    if (excludedUserId && user.id === excludedUserId) {
      return false;
    }
    return normalizeEmail(user.email) === normalizedTargetEmail;
  });

  if (emailExists) {
    throw createError("User with this email already exists", 400);
  }
};

export const getAllUsers = async (
  options: GetUsersOptions = {},
): Promise<PaginatedUsersResult> => {
  const { searchQuery, page, limit } = options;
  const normalizedLimit = Math.min(toPositiveInt(limit, DEFAULT_LIMIT), MAX_LIMIT);
  const normalizedPage = toPositiveInt(page, DEFAULT_PAGE);
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);

  const users = await readUsers();
  const filteredUsers = normalizedSearchQuery
    ? users.filter((user) => matchesSearch(user, normalizedSearchQuery))
    : users;

  const total = filteredUsers.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / normalizedLimit);
  const currentPage = Math.min(normalizedPage, totalPages);
  const startIndex = (currentPage - 1) * normalizedLimit;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + normalizedLimit);

  return {
    data: paginatedUsers,
    pagination: {
      page: currentPage,
      limit: normalizedLimit,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
};

export const getUserById = async (id: string): Promise<User> => {
  const users = await readUsers();
  return getExistingUserById(users, id);
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const validatedData = userSchema.parse(userData);
  const users = await readUsers();

  assertUniqueEmail(users, validatedData.email);

  const timestamp = new Date().toISOString();
  const newUser: User = {
    ...validatedData,
    id: generateId(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
};

export const updateUser = async (
  id: string,
  updateData: UpdateUserData,
): Promise<User> => {
  const users = await readUsers();
  const userIndex = getUserIndexById(users, id);

  if (userIndex === -1) {
    throw createError(`User with id ${id} not found`, 404);
  }

  const validatedUpdate = userSchema.partial().parse(updateData);

  if (validatedUpdate.email) {
    assertUniqueEmail(users, validatedUpdate.email, id);
  }

  users[userIndex] = {
    ...users[userIndex],
    ...validatedUpdate,
    updatedAt: new Date().toISOString(),
  };
  await writeUsers(users);

  return users[userIndex];
};

export const deleteUser = async (id: string): Promise<User> => {
  const users = await readUsers();
  const userIndex = getUserIndexById(users, id);

  if (userIndex === -1) {
    throw createError(`User with id ${id} not found`, 404);
  }

  const [deletedUser] = users.splice(userIndex, 1);
  await writeUsers(users);

  return deletedUser;
};
