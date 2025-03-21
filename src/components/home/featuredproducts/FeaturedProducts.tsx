"use client";

import { useTranslation } from "react-i18next";  
import Image from "next/image";
import styles from "@/components/home/featuredproducts/FeaturedProducts.module.scss";
import { useEffect, useState } from "react";

const FeaturedProducts = () => {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <h2 className="text-2xl text-center">Cargando...</h2>; // Evita el error de hidratación

  const products = [
    {
      id: 1,
      name: "Light Brown Shoes",
      category: "SPORTS SUMMER",
      price: 49.00,
      oldPrice: 59.00,
      discount: 17,
      image: "/products/tenis1.jpg",
    },
    {
      id: 2,
      name: "Brown Shoes",
      category: "MAIN SPORTS",
      price: 59.00,
      image: "/products/tenis2.jpg",
    },
    {
      id: 3,
      name: "Yellow Men Shoes",
      category: "FASHION MAN",
      price: 49.00,
      oldPrice: 59.00,
      discount: 17,
      image: "/products/tenis3.jpg",
    },
    {
      id: 4,
      name: "Black Shoes",
      category: "MAIN SPORTS",
      price: 159.00,
      image: "/products/tenis4.jpg",
    },
  ];

  return (
    <section className="py-12 px-12">
      <h2 className="text-2xl font-semibold text-center">
        {t("featured")}
      </h2>
      <p className="text-gray-500 text-center mb-6">
        {t("featuredDescription")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md bg-white relative">
            {product.discount && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded absolute top-2 left-2">
                -{product.discount}%
              </span>
            )}
            <div className="relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                className={styles.img} 
                width={200} 
                height={200} 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{product.category}</p>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-lg font-bold text-red-600">
              ${product.price.toFixed(2)}
              {product.oldPrice && <span className="text-gray-400 line-through text-sm ml-2">${product.oldPrice.toFixed(2)}</span>}
            </p>
            <button className="mt-2 bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
