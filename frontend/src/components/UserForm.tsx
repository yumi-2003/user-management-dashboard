import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "../types";
import Button from "./ui/Button";

const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(40, "Username must be at most 40 characters"),
  email: z.string().trim().email("Invalid email address"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

type UserFormProps = {
  initialData?: User | null;
  onSubmit?: (data: UserFormValues) => Promise<unknown> | unknown;
  onClose?: () => void;
};

const baseInputClasses =
  "mt-2 h-12 w-full rounded-xl border px-4 text-[1.05rem] text-slate-800 outline-none transition-all placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500";
const errorInputClasses =
  "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-900/30";
const defaultInputClasses =
  "border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-blue-500 dark:focus:ring-blue-900/40";

const UserForm = ({ initialData, onSubmit, onClose }: UserFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  //to set initial values for the form when the component is mounted
  const defaultValues = useMemo<UserFormValues>(
    () => ({
      name: initialData?.name ?? "",
      username: initialData?.username ?? "",
      email: initialData?.email ?? "",
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onFormSubmit = async (data: UserFormValues) => {
    if (!onSubmit) {
      setSubmitError("Submit action is currently unavailable.");
      return;
    }

    setSubmitError(null);
    try {
      await onSubmit(data);
      onClose?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save user details";
      setSubmitError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full space-y-5"
      noValidate
    >
      <div>
        <label
          htmlFor="name"
          className="text-[1.05rem] font-medium text-slate-900 dark:text-slate-100"
        >
          Name *
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Enter full name"
          autoFocus
          className={`${baseInputClasses} ${errors.name ? errorInputClasses : defaultInputClasses}`}
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="username"
          className="text-[1.05rem] font-medium text-slate-900 dark:text-slate-100"
        >
          Username *
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="Enter username"
          className={`${baseInputClasses} ${errors.username ? errorInputClasses : defaultInputClasses}`}
          {...register("username")}
        />
        {errors.username ? (
          <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-[1.05rem] font-medium text-slate-900 dark:text-slate-100"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter email address"
          className={`${baseInputClasses} ${errors.email ? errorInputClasses : defaultInputClasses}`}
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      {submitError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {submitError}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-3 pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 min-w-[100px] px-7 text-[1.05rem]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-11 min-w-[140px] px-8 text-[1.05rem]"
        >
          {initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
