import { useState, useEffect, useRef } from "react";
import * as userService from "../services/userService";
import type { PaginationMeta, User, UserInput } from "../types";

function getErrMsg(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

const DEFAULT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 350;

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<PaginationMeta>(defaultPagination);
  const [searchQuery, setSearchQueryState] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  //to reload latest updated list even if page doesn't change
  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const setSearchQuery = (value: string) => {
    setSearchQueryState((prev) => (prev === value ? prev : value));
    setPagination((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
  };

  const setPage = (page: number) => {
    const normalizedPage = Math.max(1, Math.trunc(page));
    setPagination((prev) => ({
      ...prev,
      page: prev.page === normalizedPage ? prev.page : normalizedPage,
    }));
  };

  const setLimit = (limit: number) => {
    const normalizedLimit = Math.max(1, Math.trunc(limit));
    setPagination((prev) => {
      if (prev.limit === normalizedLimit && prev.page === 1) {
        return prev;
      }

      return {
        ...prev,
        limit: normalizedLimit,
        page: 1,
      };
    });
  };

  const removeUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      refresh();
    } catch (err) {
      setError(getErrMsg(err) || "Failed to delete user");
    }
  };

  const createUser = async (data: UserInput) => {
    try {
      const created = await userService.createUser(data);
      refresh();
      return created;
    } catch (err) {
      setError(getErrMsg(err) || "Failed to create user");
      throw err;
    }
  };

  const updateUser = async (id: string, data: Partial<UserInput>) => {
    try {
      const updated = await userService.updateUser(id, data);
      refresh();
      return updated;
    } catch (err) {
      setError(getErrMsg(err) || "Failed to update user");
      throw err;
    }
  };

  useEffect(() => {
    //for async state updates
    let isActive = true;

    const fetchUsers = async () => {
      if (!hasLoadedOnceRef.current) {
        setLoading(true);
      }
      setError(null);

      try {
        const usersResult = await userService.getAllUsers({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearchQuery,
        });

        if (!isActive) return;
        setUsers(usersResult.data);
        setPagination(usersResult.pagination);
      } catch (err) {
        if (!isActive) return;
        setError(getErrMsg(err) || "Failed to load users");
      } finally {
        if (isActive) {
          setLoading(false);
          hasLoadedOnceRef.current = true;
        }
      }
    };

    void fetchUsers();

    return () => {
      isActive = false;
    };
  }, [pagination.page, pagination.limit, debouncedSearchQuery, refreshKey]);

  return {
    users,
    loading,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
    pagination,
    setPage,
    setLimit,
    removeUser,
    createUser,
    updateUser,
  };
};
