import { useState, useEffect, useCallback, useRef } from "react";
import * as userService from "../services/userService";
import type { User, UserInput } from "../types/index";

function getErrMsg(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const usersRef = useRef<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      Promise.resolve().then(() => {
        if (mountedRef.current) setLoading(true);
      });

      const data = await userService.getAllUsers();
      if (mountedRef.current) {
        setUsers(data);
        usersRef.current = data;
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrMsg(err) || "Failed to load users");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const removeUser = useCallback(async (id: string) => {
    const prev = usersRef.current;
    setUsers((s) => s.filter((u) => u.id !== id));
    usersRef.current = usersRef.current.filter((u) => u.id !== id);
    try {
      await userService.deleteUser(id);
    } catch (err) {
      setUsers(prev);
      usersRef.current = prev;
      setError(getErrMsg(err) || "Failed to delete user");
      throw err;
    }
  }, []);

  const createUser = useCallback(async (data: UserInput) => {
    try {
      const created = await userService.createUser(data);
      setUsers((s) => {
        const next = [created, ...s];
        usersRef.current = next;
        return next;
      });
      return created;
    } catch (err) {
      setError(getErrMsg(err) || "Failed to create user");
      throw err;
    }
  }, []);

  const updateUser = useCallback(
    async (id: string, data: Partial<UserInput>) => {
      try {
        const updated = await userService.updateUser(id, data);
        setUsers((s) => {
          const next = s.map((u) => (u.id === id ? updated : u));
          usersRef.current = next;
          return next;
        });
        return updated;
      } catch (err) {
        setError(getErrMsg(err) || "Failed to update user");
        throw err;
      }
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    Promise.resolve().then(() => {
      if (mountedRef.current) fetchUsers();
    });
    return () => {
      mountedRef.current = false;
    };
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    removeUser,
    createUser,
    updateUser,
  };
};
