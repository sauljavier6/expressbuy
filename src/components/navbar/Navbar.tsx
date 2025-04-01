"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image"; // Importa Image si usas imágenes optimizadas

const Navbar = () => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();

  // Estado para manejar el idioma en el cliente
  const [language, setLanguage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Estado para el menú móvil

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
    <nav className="p-4 bg-black text-white flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-lg font-semibold">
        LOGO
      </Link>

      {/* Menú para pantallas grandes */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-white">{t("home")}</Link>
        <Link href="/products/product" className="text-white">{t("products")}</Link>
        <Link href="/admin" className="text-white">{t("admin")}</Link>
        <Link href="/account" className="text-white">{t("myAccount")}</Link>
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

      {/* Selector de idioma */}
      <select
        className="bg-gray-800 text-white px-3 py-1 rounded hidden md:block"
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>

      {/* Botón menú hamburguesa (solo en móviles) */}
      <button 
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          // Icono de cerrar con filtro CSS para cambiar el color
          <Image
            src="/icons/close.png"
            alt="Close menu"
            width={28}
            height={28}
            className="filter invert"
          />
        ) : (
          // Icono de menú con filtro CSS para cambiar el color
          <Image
            src="/icons/more.png"
            alt="Open menu"
            width={28}
            height={28}
            className="filter invert"
          />
        )}
      </button>

      {/* Menú desplegable en móviles */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 shadow-lg z-50">
          <Link href="/" className="text-white" onClick={() => setMenuOpen(false)}>{t("home")}</Link>
          <Link href="/products/product" className="text-white" onClick={() => setMenuOpen(false)}>{t("products")}</Link>
          <Link href="/admin" className="text-white" onClick={() => setMenuOpen(false)}>{t("admin")}</Link>
          <Link href="/account" className="text-white" onClick={() => setMenuOpen(false)}>{t("myAccount")}</Link>
          <Link href="/cart" className="text-white" onClick={() => setMenuOpen(false)}>{t("cart")}</Link>
          {session ? (
            <button
              onClick={() => {
                signOut();
                setMenuOpen(false);
              }}
              className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              {t("logOut")}
            </button>
          ) : (
            <Link 
              href="/login" 
              className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
              onClick={() => setMenuOpen(false)}
            >
              {t("logIn")}
            </Link>
          )}
          
          {/* Selector de idioma en móvil */}
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
      )}
    </nav>
  );
};

export default Navbar;
