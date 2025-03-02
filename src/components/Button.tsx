"use client";

interface ButtonProps {
  onClick?: () => void; // ✅ Make onClick optional
  children: React.ReactNode;
}

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button onClick={onClick} className="bg-primary text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}
