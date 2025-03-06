"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslator } from "@/utils/i18n";
import api from "@/utils/api"; // API for token refresh

export default function HomePage() {
  const router = useRouter();
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key); // Default translation function
  const [isRedirecting, setIsRedirecting] = useState(true);
  // const [locale, setLocale] = useState("en");

  useEffect(() => {
    async function loadTranslations() {
      const storedLocale = localStorage.getItem("language") || "en";
      // setLocale(storedLocale);
      const translator = await getTranslator(storedLocale);
      setT(() => translator);
    }

    async function checkAuth() {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        router.replace("/movie"); //redirect to ovies page
      } else {
        try {
          const newAccessToken = await api.refreshAccessToken();
          if (newAccessToken) {
            router.replace("/movie");
          } else {
            router.replace("/login");
          }
        } catch (error) {
          router.replace("/login");
        }
      }

      setIsRedirecting(false);
    }

    loadTranslations();
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {isRedirecting ? (
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-400" aria-live="polite">
            {t("redirecting")} 
          </p>
        </div>
      ) : null}
    </div>
  );
}
