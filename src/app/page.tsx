"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // 

export default function HomePage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        router.push("/movie"); //If access token exists, go to movies
      } else {
        try {
          // Try refreshing the token if the user has logged in before
          const newAccessToken = await api.refreshAccessToken();
          if (newAccessToken) {
            router.push("/movie"); 
          } else {
            router.push("/login"); 
          }
        } catch (error) {
          router.push("/login");
        }
      }

      setIsRedirecting(false);
    };

    checkAuth();
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
