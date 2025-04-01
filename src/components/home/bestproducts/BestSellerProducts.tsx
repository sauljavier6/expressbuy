"use client";

import { useTranslation } from "react-i18next";  // Importa la función de traducción
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const BestSellerProducts = () => {
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
      image: "/products/best1.jpeg",
    },
    {
      id: 2,
      name: "Brown Shoes",
      category: "MAIN SPORTS",
      price: 59.00,
      image: "/products/best2.png",
    },
    {
      id: 3,
      name: "Yellow Men Shoes",
      category: "FASHION MAN",
      price: 49.00,
      image: "/products/best3.jpg",
    },
  ];

  return (
    <section className="py-12 px-6 md:px-12">
      <h2 className="text-2xl font-semibold text-center">
        {t("bestSeller")}
      </h2>
      <p className="text-gray-500 text-center mb-6">{t("bestSellerDescription")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md bg-white relative">
            <div className="relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={200} 
                height={200} 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{product.category}</p>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-lg font-bold text-red-600">${product.price.toFixed(2)}</p>
            <Link href="#" passHref>
              <button className="mt-2 bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition">
                Add to Cart
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellerProducts;
