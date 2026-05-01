import { useEffect, useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { User, UserInput } from "../types";
import Button from "../components/ui/Button";
import UserTable from "../components/UserTable";
import SearchBar from "../components/SearchBar";
import UserForm from "../components/UserForm";
import UserDetails from "../components/UserDetails";
import Modal from "../components/ui/Modal";
import { MoonIcon, PlusIcon, SunIcon, UsersIcon } from "../icons/icon";

type ThemeMode = "light" | "dark";
type ModalMode = "create" | "edit" | "view" | null;

const THEME_STORAGE_KEY = "dashboard-theme";
const MODAL_TYPE: Record<
  Exclude<ModalMode, null>,
  { title: string; description: string }
> = {
  create: {
    title: "Create New User",
    description: "Add a new user to the system",
  },
  edit: {
    title: "Edit User",
    description: "Update user details in the system",
  },
  view: {
    title: "User Details",
    description: "View detailed user information",
  },
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(dark-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Dashboard() {
  const {
    users,
    loading,
    error,
    removeUser,
    createUser,
    updateUser,
    searchQuery,
    setSearchQuery,
    pagination,
    setPage,
    setLimit,
  } = useUsers();

  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
  };

  const handleFormSubmit = async (formData: UserInput) => {
    if (selectedUser) {
      return updateUser(selectedUser.id, formData);
    }
    return createUser(formData);
  };

  const showingFrom =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingTo =
    pagination.total === 0 ? 0 : showingFrom + Math.max(0, users.length - 1);
  const isDarkMode = theme === "dark";
  const modalCopy = modalMode ? MODAL_TYPE[modalMode] : null;

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/40">
              <UsersIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight text-black dark:text-white">
                User Management
              </h1>
              <p className="mt-1 text-base text-slate-600 dark:text-slate-400">
                Manage and organize your users efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <button
            type="button"
            onClick={() =>
              setTheme((previousTheme) =>
                previousTheme === "light" ? "dark" : "light",
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            {isDarkMode ? <SunIcon size={17} /> : <MoonIcon size={17} />}
            {isDarkMode ? "Light" : "Dark"}
          </button>

          <Button
            onClick={handleCreate}
            leftIcon={<PlusIcon />}
            className="h-11 rounded-lg bg-black px-6 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto"
          >
            New User
          </Button>
        </div>

        <div className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          {pagination.total} users found
        </div>

        {/* Main Content Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              Users List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <UserTable
              users={users}
              loading={loading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={removeUser}
            />
          </div>

          {/* Footer-pagination */}
          <div className="flex flex-col items-center gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:justify-between">
            <span>
              Showing {showingFrom} to {showingTo} of {pagination.total} users
            </span>
            <div className="flex items-center gap-2">
              <label
                htmlFor="per-page"
                className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400"
              >
                Per page:
              </label>
              <select
                id="per-page"
                value={pagination.limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="py-1 px-3 text-xs"
                onClick={() => setPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                className="py-1 px-3 text-xs"
                onClick={() => setPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {modalMode && (
        <Modal
          title={modalCopy?.title}
          description={modalCopy?.description}
          onClose={closeModal}
        >
          {modalMode === "view" && selectedUser ? (
            <UserDetails user={selectedUser} onClose={closeModal} />
          ) : (
            <UserForm
              initialData={selectedUser}
              onSubmit={handleFormSubmit}
              onClose={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
