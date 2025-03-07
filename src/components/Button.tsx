import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx"; // Utility for conditional class names

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-[#66D37E] hover:bg-[#50C268] text-white focus:ring-[#66D37E]",
    secondary: "bg-[#1E5470] hover:bg-[#164259] text-white focus:ring-[#1E5470]",
    outline: "border border-[#66D37E] text-[#66D37E] hover:bg-[#66D37E]/10 focus:ring-[#66D37E]",
  };

  const sizeStyles = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
