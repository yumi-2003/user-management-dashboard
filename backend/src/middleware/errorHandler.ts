import type { NextFunction, Request, RequestHandler, Response } from "express";

export type AppError = Error & {
  statusCode?: number;
};

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

//status code for errorHandler global middleware
const inferStatusCode = (err: AppError): number => {
  if (err.statusCode) {
    return err.statusCode;
  }

  const message = err.message.toLowerCase();
  if (message.includes("not found")) return 404;
  if (message.includes("already exists")) return 400;
  if (message.includes("validation")) return 400;

  return 500;
};

/**
 * Simple global error handler for Express
 * Catches and handles all errors in application
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", err.message);

  const statusCode = inferStatusCode(err);
  const message = err.message || DEFAULT_ERROR_MESSAGE;

  res.status(statusCode).json({
    success: false,
    message,
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
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

/**
 * Wraps async functions to catch errors automatically
 * This prevents from using try-catch in every route handler
 */
export const asyncHandler = (handler: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };
};

/**
 * Handles 404 errors for routes that don't exist
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(createError(`Route ${req.originalUrl} not found`, 404));
};
