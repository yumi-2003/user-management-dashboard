import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../../data/users.json");
const dataDir = path.join(__dirname, "../../data");

/**
 * Ensures the data directory exists
 */
const ensureDataDirectory = async () => {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

/**
 * Reads users from JSON file
 * @returns Array of users
 */
export const readUsers = async () => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(filePath, "utf-8");

    try {
      const parsed = JSON.parse(data);
      // Ensure it's an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      console.error(
        "Invalid JSON in users file, returning empty array:",
        parseError,
      );
      // Return empty array for corrupted JSON
      return [];
    }
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array
      console.log("Users file doesn't exist, returning empty array");
      return [];
    }
    console.error("Error reading users file:", error);
    throw new Error("Failed to read users data");
  }
};

/**
 * Writes users to JSON file
 * @param data - Users data to write
 */
export const writeUsers = async (data: any) => {
  try {
    await ensureDataDirectory();

    // Validate data is an array
    if (!Array.isArray(data)) {
      throw new Error("Users data must be an array");
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error("Error writing users file:", error);
    throw new Error("Failed to save users data");
  }
};
