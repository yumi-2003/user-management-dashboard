import {
  ArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "../icons/icon";
import type { User } from "../types";
import { formatDate } from "../utils/date";

type UserTableProps = {
  users?: User[];
  loading?: boolean;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
};

const skeletonRows = 6;

const UserTable = ({ users = [], loading, onView, onEdit, onDelete }: UserTableProps) => {
  if (loading) {
    return (
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-white text-left text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <th className="px-6 py-4 text-base font-semibold">Name</th>
            <th className="px-6 py-4 text-base font-semibold">Username</th>
            <th className="px-6 py-4 text-base font-semibold">Email</th>
            <th className="px-6 py-4 text-base font-semibold">Created</th>
            <th className="px-6 py-4 text-center text-base font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: skeletonRows }, (_, index) => (
            <tr key={`skeleton-row-${index}`} className="border-b border-slate-200 dark:border-slate-800">
              <td className="px-6 py-4">
                <div className="h-6 w-44 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-52 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-28 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  <div className="h-8 w-8 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  <div className="h-8 w-8 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className="min-w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-slate-200 bg-white text-left text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          <th className="px-6 py-4 text-base font-semibold">
            <span className="inline-flex items-center gap-2">
              Name <ArrowUpIcon size={14} aria-hidden="true" />
            </span>
          </th>
          <th className="px-6 py-4 text-base font-semibold">Username</th>
          <th className="px-6 py-4 text-base font-semibold">Email</th>
          <th className="px-6 py-4 text-base font-semibold">Created</th>
          <th className="px-6 py-4 text-center text-base font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td className="px-6 py-12 text-center text-slate-500 dark:text-slate-400" colSpan={5}>
              No users found.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-200 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <td className="px-6 py-4 text-base font-semibold text-slate-900 dark:text-slate-100">{user.name}</td>
              <td className="px-6 py-4">
                <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {user.username}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.email}</td>
              <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{formatDate(user.createdAt)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onView?.(user)}
                    className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    aria-label={`View ${user.name}`}
                  >
                    <EyeIcon size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(user)}
                    className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    aria-label={`Edit ${user.name}`}
                  >
                    <PencilIcon size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(user.id)}
                    className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    aria-label={`Delete ${user.name}`}
                  >
                    <TrashIcon size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
