import type { User } from "../types";
import Button from "./ui/Button";
import { formatDateTime } from "../utils/date";

type UserDetailsProps = {
  user: User;
  onClose?: () => void;
};

const UserDetails = ({ user, onClose }: UserDetailsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {user.name}
        </h3>
        <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
          {user.username}
        </span>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400">
            Email
          </p>
          <p className="mt-1 text-xl text-slate-900 dark:text-slate-100">
            {user.email}
          </p>
        </div>

        {/* <div>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400">
            User ID
          </p>
          <div className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-xl text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            {user.id}
          </div>
        </div> */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400">
              Created
            </p>
            <p className="mt-1 text-xl text-slate-900 dark:text-slate-100">
              {formatDateTime(user.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400">
              Updated
            </p>
            <p className="mt-1 text-xl text-slate-900 dark:text-slate-100">
              {formatDateTime(user.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          className="h-11 px-6 text-base"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserDetails;
