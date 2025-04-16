"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLanguage(i18n.language || "en");
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
  };

  const logOut = () => {
    signOut();
    localStorage.clear();
    setMenuOpen(false);
  };

  if (!language) return null;

  // Array de enlaces para el menú, incluyendo la verificación del rol de admin
  const navItems = [
    { href: "/", label: t("home") },
    { href: "/products/product", label: t("products") },
    session?.user?.role === "admin" ? { href: "/admin", label: t("admin") } : null,
    { href: "/account", label: t("myAccount") },
    { href: "/cart", label: t("cart") },
  ].filter(Boolean); // Filtramos cualquier valor nulo o falso

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
        <img src="/logo/logo.png" alt="Logo" className="w-32 h-auto object-contain" />
        </Link>

        {/* Menú en pantallas grandes */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            // Verificación de que 'item' no es null
            if (item) {
              return (
                <Link
                  key={item.href}  // Asegúrate de usar 'href' como key, ya que es único
                  href={item.href}
                  className="text-sm hover:text-gray-300 transition"
                >
                  {item.label}
                </Link>
              );
            }
            return null;  // Si 'item' es null, no se renderiza nada
          })}

          {/* Sesión */}
          {session ? (
            <button
              onClick={logOut}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
            >
              {t("logOut")}
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
            >
              {t("logIn")}
            </Link>
          )}

          {/* Idioma */}
          <select
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded-md"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
        </div>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Image
            src={menuOpen ? "/icons/close.png" : "/icons/more.png"}
            alt="Menu"
            width={28}
            height={28}
            className="filter invert"
          />
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 w-full py-4 space-y-4 text-center transition-all duration-300">
          {navItems.map((item) => {
            // Verificación de que 'item' no es null
            if (item) {
              return (
                <Link
                  key={item.href}  // Asegúrate de usar 'href' como key, ya que es único
                  href={item.href}
                  onClick={() => setMenuOpen(false)}  // Cerrar el menú al hacer clic en un enlace
                  className="block text-sm text-white hover:text-gray-300 transition"
                >
                  {item.label}
                </Link>
              );
            }
            return null;  // Si 'item' es null, no se renderiza nada
          })}

          {session ? (
            <button
              onClick={logOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              {t("logOut")}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}  // Cerrar el menú al hacer clic en el enlace
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              {t("logIn")}
            </Link>
          )}

          <div className="mt-2">
            <select
              className="bg-gray-800 text-white px-3 py-1 rounded-md"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
