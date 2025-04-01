"use client";

import { FC, useEffect, useState } from "react";
import styles from "./SideBar.module.scss";

interface SidebarProps {
  setCategoryId: (id: string | null) => void;
  setProductTypeId: (id: string | null) => void;
}

const SideBar: FC<SidebarProps> = ({ setCategoryId, setProductTypeId }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<{ id: string; name: string }[]>([]);

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

  const handleResetFilters = () => {
    setCategoryId(null);
    setProductTypeId(null);
    setOpenMenu(null);
  };

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    setProductTypeId(null); // Resetea el tipo de producto al seleccionar una categoría
  };

  const handleProductTypeSelect = (id: string) => {
    setProductTypeId(id);
    setCategoryId(null); // Resetea la categoría al seleccionar un tipo de producto
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <img src="/logo/logo.jpg" alt="Logo" />
      </div>

      <h3>Home</h3>
      
      {/* Botón para ver todos los productos */}
      <ul>
      <li className={styles.sidebar__item}>
        <button onClick={handleResetFilters} className={styles.sidebar__button}>
          See all
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
              {menu}
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