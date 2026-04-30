import express from "express";
import cors from "cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import { config } from "./config/env.js";

const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/users", userRoutes);

// Error handling middleware at Last
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
