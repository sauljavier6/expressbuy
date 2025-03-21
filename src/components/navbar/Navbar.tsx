"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();

  // Estado para manejar el idioma en el cliente
  const [language, setLanguage] = useState("");

  useEffect(() => {
    // Establecer el idioma inicial basado en i18n
    setLanguage(i18n.language || "es");
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
  };

  // Evitar renderizado incorrecto en SSR
  if (!language) return null;

  return (
    <nav className="p-4 bg-black text-white flex justify-end items-center space-x-6">
      <div className="flex space-x-4">
        <Link href="/" className="text-white">{t("home")}</Link>
        <Link href="/" className="text-white">{t("myAccount")}</Link>
        <Link href="/products" className="text-white">{t("myWishlist")}</Link>
        <Link href="/cart" className="text-white">{t("cart")}</Link>

        {session ? (
          <button
            onClick={() => signOut()}
            className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            {t("logOut")}
          </button>
        ) : (
          <Link href="/login" className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition">
            {t("logIn")}
          </Link>
        )}
      </div>

      <div className="relative">
        <select
          className="bg-gray-800 text-white px-3 py-1 rounded"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
