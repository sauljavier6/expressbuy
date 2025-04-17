"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SideBar.module.scss";
import { useTranslation } from "react-i18next";

const SideBar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {

      try {
        const res = await fetch("/api/categories");
  
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  
        const text = await res.text();
        if (!text) {
          console.warn("Categorías vacías");
          setCategories([]);
          return;
        }
  
        const data = JSON.parse(text);
  
        if (Array.isArray(data)) {
          setCategories(
            data.map((category: { name: string; _id: string }) => ({
              name: category.name,
              id: category._id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    const fetchProductTypes = async () => {
      try {
        const res = await fetch("/api/producttype");
  
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  
        const text = await res.text();
        if (!text) {
          console.warn("Tipos de producto vacíos");
          setProductTypes([]);
          return;
        }
  
        const data = JSON.parse(text);
  
        if (Array.isArray(data)) {
          setProductTypes(
            data.map((type: { name: string; _id: string }) => ({
              name: type.name,
              id: type._id,
            }))
          );
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

  const goToProductsPage = (type: "category" | "product", id: string) => {
    if (type === "category") {
      router.push(`/products/product?categoryId=${id}`);
    } else {
      router.push(`/products/product?productTypeId=${id}`);
    }
  };

  if (!isClient) return null;
   
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <img src="/logo/logo.png" alt="Logo" />
      </div>
      <h3>{t("sidebar.home")}</h3>
      <ul>
        {["Categories", "Products"].map((menu) => (
          <li key={menu} className={styles.sidebar__item}>
            <button 
              onClick={() => toggleMenu(menu)} 
              className={`${styles.sidebar__button} ${openMenu === menu ? styles.open : ""}`}
            >
              {t(`sidebar.${menu.toLowerCase()}`)}
              <img 
                src="/icons/next.png" 
                alt="Arrow" 
                className={styles.sidebar__arrow} 
              />
            </button>

            {openMenu === "Categories" && menu === "Categories" && (
              <ul className={styles.sidebar__submenu}>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <button onClick={() => goToProductsPage("category", cat.id)}>
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
                      <button onClick={() => goToProductsPage("product", type.id)}>
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
