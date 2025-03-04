"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    router.push(token ? "/movie" : "/login");
    setIsRedirecting(false);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {isRedirecting ? (
        <div className="flex flex-col items-center">
          
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-400" aria-live="polite">
            Redirecting...
          </p>
        </div>
      ) : null}
    </div>
  );
}
