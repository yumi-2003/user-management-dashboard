import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { User } from "../types/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../../data/users.json");
const dataDir = path.join(__dirname, "../../data");

const ensureDataDirectory = async () => {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

const parseUsersJson = (raw: string): User[] => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch (parseError) {
    console.error(
      "Invalid JSON in users file, returning empty array:",
      parseError,
    );
    return []; //prevent app crashed
  }
};

export const readUsers = async (): Promise<User[]> => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(filePath, "utf-8");
    return parseUsersJson(data);
  } catch (error) {
    //if file doesn't exist return empty array to avoid the app crash on first run
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    console.error("Error reading users file:", error);
    throw new Error("Failed to read users data");
  }
};

export const writeUsers = async (users: User[]): Promise<void> => {
  try {
    await ensureDataDirectory();
    await fs.writeFile(filePath, `${JSON.stringify(users, null, 2)}\n`);
  } catch (error) {
    console.error("Error writing users file:", error);
    throw new Error("Failed to save users data");
  }
};
