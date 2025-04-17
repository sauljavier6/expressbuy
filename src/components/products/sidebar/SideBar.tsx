"use client";

import { FC, useEffect, useState } from "react";
import styles from "./SideBar.module.scss";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  setCategoryId: (id: string | null) => void;
  setProductTypeId: (id: string | null) => void;
  setIsSidebarOpen?: (state: boolean) => void; // ← esta es la nueva prop
}


const SideBar: FC<SidebarProps> = ({ setCategoryId, setProductTypeId, setIsSidebarOpen }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<{ id: string; name: string }[]>([]);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(
            data.map((category: { name: string; _id: string }) => ({
              name: category.name,
              id: category._id,
            }))
          );
        } else {
          console.error("Invalid categories data:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProductTypes = async () => {
      try {
        const res = await fetch("/api/producttype");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProductTypes(
            data.map((type: { name: string; _id: string }) => ({
              name: type.name,
              id: type._id,
            }))
          );
        } else {
          console.error("Invalid product types data:", data);
        }
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchCategories();
    fetchProductTypes();
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    setProductTypeId(null);
    setIsSidebarOpen?.(false); // ← Cierra si está definida
  };
  
  const handleProductTypeSelect = (id: string) => {
    setProductTypeId(id);
    setCategoryId(null);
    setIsSidebarOpen?.(false); // ← Cierra si está definida
  };
  
  const handleResetFilters = () => {
    setCategoryId(null);
    setProductTypeId(null);
    setOpenMenu(null);
    setIsSidebarOpen?.(false); // ← También cierra si se da "See all"
  };

  if (!isClient) return null;
  

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <img src="/logo/logo.png" alt="Logo" />
      </div>

      <h3>{t("sidebar.home")}</h3>
      
      {/* Botón para ver todos los productos */}
      <ul>
      <li className={styles.sidebar__item}>
        <button onClick={handleResetFilters} className={styles.sidebar__button}>
        {t("sidebar.seeAll")}
        </button>
      </li>
      </ul>

      <ul>
        {["Categories", "Products"].map((menu) => (
          <li key={menu} className={styles.sidebar__item}>
            <button
              onClick={() => toggleMenu(menu)}
              className={`${styles.sidebar__button} ${openMenu === menu ? styles.open : ""}`}
            >
              {t(`sidebar.${menu.toLowerCase()}`)}
              <img src="/icons/next.png" alt="Arrow" className={styles.sidebar__arrow} />
            </button>

            {openMenu === "Categories" && menu === "Categories" && (
              <ul className={styles.sidebar__submenu}>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <button onClick={() => handleCategorySelect(cat.id)}>
                        {cat.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li>Loading...</li>
                )}
              </ul>
            )}

            {openMenu === "Products" && menu === "Products" && (
              <ul className={styles.sidebar__submenu}>
                {productTypes.length > 0 ? (
                  productTypes.map((type) => (
                    <li key={type.id}>
                      <button onClick={() => handleProductTypeSelect(type.id)}>
                        {type.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li>Loading...</li>
                )}
              </ul>
            )}

            <hr className={styles.sidebar__divider} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;