"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { getTranslator } from "@/utils/i18n";
import LanguageSelector from "@/components/LanguageSelector";

// Logout Utility Function
const logoutUser = (router: any) => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");
  router.push("/login");
};

export default function Navbar({
  showAddButton,
  onAddClick,
}: {
  showAddButton: boolean;
  onAddClick: () => void;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState("en");
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key);

  useEffect(() => {
    async function loadTranslations() {
      const translator = await getTranslator(locale);
      setT(() => translator);
    }
    const storedLocale = localStorage.getItem("language") || "en";
    setLocale(storedLocale);
    loadTranslations();
  }, [locale]);

  return (
    <nav className="navbar w-full bg-[#0E2A3F] px-6 py-4 flex justify-between items-center shadow-md relative">
      {/* Left: App Title & Add Movie Button */}
      <div className="flex items-center space-x-3">
        <h1 className="navbar-title text-2xl font-bold">{t("appTitle")}</h1>
        {showAddButton && (
          <FaPlusCircle
            className="text-lg cursor-pointer hover:text-gray-400"
            onClick={onAddClick}
            aria-label={t("addMovie")}
          />
        )}
      </div>

      {/* Center: Language Selector */}
      <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2">
        <LanguageSelector /> {/* ✅ Only used here */}
      </div>

      {/* Mobile View: Language Selector Below Title */}
      <div className="sm:hidden absolute top-14 left-6">
        <LanguageSelector />
      </div>

      {/* Right: Logout Button */}
      <button
        className="flex items-center text-lg hover:text-gray-400"
        onClick={() => logoutUser(router)}
        aria-label={t("logout")}
      >
        {t("logout")} <FiLogOut className="ml-2" />
      </button>
    </nav>
  );
}
