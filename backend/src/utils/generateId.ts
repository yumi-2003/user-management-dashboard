import { randomBytes } from "crypto";

export const generateId = (length: number = 8): string => {
  try {
    return randomBytes(length).toString("hex");
  } catch (error) {
    console.error("Error generating ID:", error);
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
};
