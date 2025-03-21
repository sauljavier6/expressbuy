"use client";

import { useEffect, useState } from "react";
import styles from "./SideBar.module.scss";

const SideBar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setCategories(data.map((category: { name: string }) => category.name));
        } else {
          console.error("Invalid categories data:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = (category: string) => {
    setOpenMenu(openMenu === category ? null : category);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <img src="/logo/logo.jpg" alt="Logo" />
      </div>
      <h3>Home</h3>
      <ul>
        {["Categories", "Products", "Features", "Elements"].map((category) => (
          <li key={category} className={styles.sidebar__item}>
            <button 
              onClick={() => toggleMenu(category)} 
              className={`${styles.sidebar__button} ${openMenu === category ? styles.open : ""}`}
            >
              {category} 
              <img 
                src="/icons/next.png" 
                alt="Arrow" 
                className={styles.sidebar__arrow} 
              />
            </button>

            {openMenu === "Categories" && category === "Categories" && (
              <ul className={styles.sidebar__submenu}>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat}><a href="#">{cat}</a></li>
                  ))
                ) : (
                  <li>Cargando...</li>
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
