import type { Request } from "express";
import { asyncHandler, createError } from "../middleware/errorHandler.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../services/userService.js";

const getSingleQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : undefined;
  }
  return typeof value === "string" ? value : undefined;
};

const parsePositiveIntegerQuery = (value: string | undefined, fieldName: string) => {
  if (value === undefined) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw createError(`${fieldName} must be a positive integer`, 400);
  }

  return parsed;
};

const getRouteId = (req: Request): string => {
  const { id } = req.params;
  if (!id || Array.isArray(id)) {
    throw createError("Valid user ID is required", 400);
  }
  return id;
};

export const getUsers = asyncHandler(
  async (req, res) => {
    const { search, page, limit } = req.query;

    const usersResult = await getAllUsers({
      searchQuery: getSingleQueryValue(search),
      page: parsePositiveIntegerQuery(getSingleQueryValue(page), "page"),
      limit: parsePositiveIntegerQuery(getSingleQueryValue(limit), "limit"),
    });

    res.status(200).json({
      success: true,
      count: usersResult.data.length,
      total: usersResult.pagination.total,
      pagination: usersResult.pagination,
      data: usersResult.data,
    });
  },
);

export const getUser = asyncHandler(
  async (req, res) => {
    const user = await getUserById(getRouteId(req));

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

export const createUserHandler = asyncHandler(
  async (req, res) => {
    const userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      throw createError("User data is required", 400);
    }

    const newUser = await createUser(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  },
);

export const updateUserHandler = asyncHandler(
  async (req, res) => {
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      throw createError("Update data is required", 400);
    }

    const updatedUser = await updateUser(getRouteId(req), updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  },
);

export const deleteUserHandler = asyncHandler(
  async (req, res) => {
    const deletedUser = await deleteUser(getRouteId(req));

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  },
);
