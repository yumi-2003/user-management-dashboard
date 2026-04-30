import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Simple global error handler for Express
 * Catches and handles all errors in application
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Log the error for debugging
  console.error("Error:", err.message);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Handle common error types
  if (err.message.includes("not found")) {
    statusCode = 404;
  }

  if (err.message.includes("already exists")) {
    statusCode = 400;
  }

  if (err.message.includes("Validation")) {
    statusCode = 400;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Show error details only in development
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      url: req.url,
    }),
  });
};

/**
 * Creates a simple error object
 */
export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Wraps async functions to catch errors automatically
 * This prevents from using try-catch in every route handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handles 404 errors for routes that don't exist
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
