import { InputHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId; // Ensures stable ID

    return (
      <div className="w-full">
        {/* Accessible Label */}
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}

        {/* Styled Input */}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            "w-full px-4 py-3 bg-[#113243] rounded-md border text-white placeholder-gray-400 focus:outline-none focus:ring-2",
            error ? "border-red-500 focus:ring-red-500" : "border-[#1E5470] focus:ring-[#66D37E]",
            className
          )}
          {...props}
        />

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
