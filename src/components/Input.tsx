"use client";

interface InputProps {
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default function Input({ type = "text", value, onChange, placeholder }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-input text-white border border-gray-400 rounded px-3 py-2 w-full"
    />
  );
}
