import { Router } from "express";
import {
  getUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/userController.js";

const router = Router();

// GET /api/users - Get all users
router.get("/", getUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", getUser);

// POST /api/users - Create new user
router.post("/", createUserHandler);

// PUT /api/users/:id - Update user
router.put("/:id", updateUserHandler);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUserHandler);

export default router;
