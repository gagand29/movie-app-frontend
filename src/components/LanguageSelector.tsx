"use client";  // This must be a client component

import { useState, useEffect } from "react";

export default function LanguageSelector() {
  const [locale, setLocale] = useState("en"); // Default to English

  useEffect(() => {
    localStorage.setItem("language", locale);
  }, [locale]);

  return (
    <div className="absolute top-4 right-4">
      <select
        className="text-black p-2 rounded-md"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
      >
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    </div>
  );
}
