import { readUsers, writeUsers } from "../utils/fileHandler.js";
import { User } from "../types/user.js";
import { userSchema } from "../schemas/user.schema.js";
import { generateId } from "../utils/generateId.js";

export type CreateUserData = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserData = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;

const matchesSearch = (user: User, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  return [user.name, user.username, user.email].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
};

export const getAllUsers = async (searchQuery?: string) => {
  try {
    const users = await readUsers();

    if (!searchQuery || !searchQuery.toString().trim()) {
      return users;
    }

    return users.filter((user) => matchesSearch(user, searchQuery.toString()));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to retrieve users data");
  }
};

//get user by id
export const getUserbyId = async (id: string) => {
  try {
    const users: User[] = await readUsers();
    const user = users.find((user) => user.id === id);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

//create user
export const createUser = async (userData: CreateUserData) => {
  try {
    // Validate user data with Zod schema
    const validatedData = userSchema.parse(userData);

    const users: User[] = await readUsers();

    // Check if user with same email already exists
    const userExist = users.find((user) => user.email === validatedData.email);
    if (userExist) {
      throw new Error("User with this email already exists");
    }

    const timestamp = new Date().toISOString();
    const newUser: User = {
      ...validatedData,
      id: generateId(), // Generate unique ID
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    users.push(newUser);
    await writeUsers(users);

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

//update user
export const updateUser = async (id: string, updateData: UpdateUserData) => {
  try {
    const users: User[] = await readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    // Validate update data
    const validatedUpdate = userSchema.partial().parse(updateData);

    // Check if email is being updated and if it conflicts
    if (
      validatedUpdate.email &&
      validatedUpdate.email !== users[userIndex].email
    ) {
      const emailExists = users.some(
        (user) => user.email === validatedUpdate.email && user.id !== id,
      );
      if (emailExists) {
        throw new Error("Email already exists for another user");
      }
    }

    users[userIndex] = {
      ...users[userIndex],
      ...validatedUpdate,
      updatedAt: new Date().toISOString(),
    };
    await writeUsers(users);

    return users[userIndex];
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

//delete user
export const deleteUser = async (id: string) => {
  try {
    const users: User[] = await readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    await writeUsers(users);

    return deletedUser;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};
