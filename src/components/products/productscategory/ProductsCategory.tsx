"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productcard/productcard";
import { useTranslation } from "react-i18next";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface ProductsCategoryProps {
  category: string | null; // Recibe category como prop
}

export default function ProductsCategory({ category }: ProductsCategoryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setError(null);

    fetch(`/api/products/category/${category}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los productos");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => setLoading(false));

      setIsClient(true);
  }, [category]);


  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {t("productsTitle")}
      </h1>

      {loading && (
        <p className="text-gray-500 col-span-full text-center">Loading products...</p>
      )}

      {error && (
        <p className="text-red-500 col-span-full text-center">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500 col-span-full text-center">
          There are no products available.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
