import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
}

const baseStyles =
  "flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-black text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500",
  outline:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost:
    "bg-transparent text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800",
};

const spinnerVariantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "border-white/70",
  danger: "border-white/70",
  outline: "border-slate-400 dark:border-slate-500",
  ghost: "border-slate-400 dark:border-slate-500",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      isLoading = false,
      leftIcon,
      loadingText,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <div
              className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${spinnerVariantStyles[variant]}`}
              aria-hidden="true"
            />
            <span className="sr-only">{loadingText ?? "Loading"}</span>
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>} {children}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
