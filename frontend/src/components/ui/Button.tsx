import React, { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
}

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
    //base styles for all buttons
    const styles =
      "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    //variant-specific styles
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-black text-white hover:bg-gray-800",
      outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
    };

    // spinner color depends on current variant to keep contrast
    const spinnerClasses =
      variant === "primary" || variant === "danger"
        ? "border-white/80 border-t-white"
        : "border-gray-400 border-t-gray-700";

    return (
      <button
        ref={ref}
        type={type}
        className={`${styles} ${variants[variant]} ${className}`}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <div
              className={`w-5 h-5 border-2 ${spinnerClasses} border-t-transparent rounded-full animate-spin`}
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
