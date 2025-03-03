"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/movie");
    } else {
      router.push("/login");
    }
  }, []);

  return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
}
