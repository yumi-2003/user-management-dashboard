import { randomBytes } from "crypto";

/**
 * Generates a unique ID using crypto.randomBytes for better randomness
 * @param length - The length of the ID in bytes (default: 8, resulting in 16 hex characters)
 * @returns A unique string ID
 */
export const generateId = (length: number = 8): string => {
  try {
    return randomBytes(length).toString("hex");
  } catch (error) {
    console.error("Error generating ID:", error);
    // Fallback to timestamp-based ID if crypto fails
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

/**
 * Generates a UUID v4 compliant ID
 * @returns A UUID v4 string
 */
export const generateUUID = (): string => {
  try {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  } catch (error) {
    console.error("Error generating UUID:", error);
    // Fallback to simple ID
    return generateId();
  }
};

/**
 * Generates a simple numeric ID based on timestamp
 * @returns A numeric string ID
 */
export const generateNumericId = (): string => {
  return Date.now().toString();
};
