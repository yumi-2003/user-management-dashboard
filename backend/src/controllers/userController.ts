import { Request, Response, NextFunction } from "express";
import { asyncHandler, createError } from "../middleware/errorHandler.js";
import {
  getAllUsers,
  getUserbyId,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";

// Get all users
// GET /api/users
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;
    const searchQuery = Array.isArray(search) ? search[0] : search;

    const users = await getAllUsers(
      typeof searchQuery === "string" ? searchQuery : undefined,
    );

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  },
);

//Get single user by ID
//GET /api/users/:id
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return next(createError("Valid user ID is required", 400));
    }

    const user = await getUserbyId(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

//Create new user
// POST /api/users
export const createUserHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return next(createError("User data is required", 400));
    }

    const newUser = await createUser(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  },
);

// Update user
//PUT /api/users/:id
export const updateUserHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || Array.isArray(id)) {
      return next(createError("Valid user ID is required", 400));
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return next(createError("Update data is required", 400));
    }

    const updatedUser = await updateUser(id, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  },
);
//Delete user
//DELETE /api/users/:id
export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return next(createError("Valid user ID is required", 400));
    }

    const deletedUser = await deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  },
);

/**
 *  manual error handling (alternative to asyncHandler)
 */
export const getUserManual = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return next(createError("Valid user ID is required", 400));
    }

    const user = await getUserbyId(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // Error from error handler
    next(error);
  }
};
