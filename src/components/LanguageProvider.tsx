"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Context for global language state
const LanguageContext = createContext<{
  locale: string;
  setLocale: (locale: string) => void;
}>({
  locale: "en",
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("en");

  // Load stored locale on client-side
  useEffect(() => {
    const storedLocale = localStorage.getItem("language") || "en";
    setLocale(storedLocale);
    document.documentElement.lang = storedLocale; /// Update <html lang="..."> immediately
  }, []);

  const updateLocale = (newLocale: string) => {
    localStorage.setItem("language", newLocale);
    setLocale(newLocale);
    document.documentElement.lang = newLocale; 
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: updateLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to access language state
export function useLanguage() {
  return useContext(LanguageContext);
}
