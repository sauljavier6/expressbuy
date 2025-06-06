"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  onSelect: (section: string) => void;
  setIsSidebarOpen?: (state: boolean) => void;
}

export default function Sidebar({ onSelect, setIsSidebarOpen }: SidebarProps) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelect = (section: string) => {
    onSelect(section);
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false); // cerrar menú en mobile después de seleccionar
    }
  };

  if (!isClient) return null;

  return (
    <div className="bg-gray-800 text-white h-full md:h-screen w-64 fixed md:static top-0 left-0 z-50 p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ul>
        <li className="mb-4">
          <button
            onClick={() => handleSelect("Category")}
            className="text-lg hover:bg-gray-700 p-2 w-full text-left"
          >
            {t("sidebaradmin.categories")}
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => handleSelect("ProductType")}
            className="text-lg hover:bg-gray-700 p-2 w-full text-left"
          >
            {t("sidebaradmin.productType")}
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
            className="text-lg hover:bg-gray-700 p-2 w-full text-left flex justify-between items-center"
          >
            {t("sidebaradmin.products")}
            <img
              src="/icons/down-arrow.png"
              alt="Flecha"
              className={`w-5 h-5 transition-transform duration-300 ${isSubmenuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isSubmenuOpen && (
            <ul className="ml-4 mt-2 bg-gray-700 rounded">
              <li>
                <button
                  onClick={() => handleSelect("ListProducts")}
                  className="hover:bg-gray-600 p-2 w-full text-left"
                >
                  {t("sidebaradmin.viewAll")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect("Products")}
                  className="hover:bg-gray-600 p-2 w-full text-left"
                >
                  {t("sidebaradmin.addProduct")}
                </button>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-4">
          <button
            onClick={() => handleSelect("Orders")}
            className="text-lg hover:bg-gray-700 p-2 w-full text-left"
          >
            {t("sidebaradmin.orders")}
          </button>
        </li>
      </ul>
    </div>
  );
}

