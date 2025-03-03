import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-[#113243] rounded-md border ${
            error ? "border-red-500" : "border-[#1E5470]"
          } text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-[#66D37E]"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;