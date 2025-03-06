"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value); //Updates instantly across app
  };

  return (
    <div className="relative">
      <select className="text-black p-2 rounded-md cursor-pointer bg-white border" value={locale} onChange={changeLanguage}>
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    </div>
  );
}
