"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productcard/productcard";
import { useTranslation } from "react-i18next";

// Definir la estructura del producto
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductPage() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
 


  useEffect(() => {
    fetch("/api/products/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener productos:", error));


      setIsClient(true);
  }, []);

  if (!isClient) return;

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {t("productsTitle")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isClient ? (
          products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Loading products...
            </p>
          )
        ) : (
          <p className="text-gray-500 col-span-full text-center">Loading products...</p>
        )}
      </div>
    </div>
  );
}
