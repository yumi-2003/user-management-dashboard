import { api } from "./api";
import type { User, UserInput } from "../types/index";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get("/");
    // backend returns { success, count, data }
    const payload = res.data;
    if (payload && Array.isArray(payload.data)) return payload.data as User[];
    if (Array.isArray(payload)) return payload as User[];
    return [];
  } catch (err) {
    console.error("getAllUsers failed:", err);
    throw err;
  }
};

export const createUser = async (userData: UserInput): Promise<User> => {
  try {
    const res = await api.post("/", userData);
    const payload = res.data;
    if (payload && payload.data) return payload.data as User;
    return payload as User;
  } catch (err) {
    console.error("createUser failed:", err);
    throw err;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<UserInput>,
): Promise<User> => {
  try {
    const res = await api.put(`/${id}`, userData);
    const payload = res.data;
    if (payload && payload.data) return payload.data as User;
    return payload as User;
  } catch (err) {
    console.error("updateUser failed:", err);
    throw err;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (err) {
    console.error("deleteUser failed:", err);
    throw err;
  }
};
