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
  size: string;
  gender: string;
}

export default function ProductPage() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        setError(t("errorFetchingProducts"));
      })
      .finally(() => {
        setLoading(false);
        setIsClient(true);
      });
  }, [t]);

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">
      {t("productsTitle")}
      </h1>
      {loading ? (
        <p className="text-gray-500 col-span-full text-center">
          {t("loadingProducts")}
        </p>
      ) : error ? (
        <p className="text-red-500 col-span-full text-center">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              {t("noProductsAvailable")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
