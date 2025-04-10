"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/productcard/productcard";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface ProductsTypeProps {
  productType: string;
}

export default function ProductsType({ productType }: ProductsTypeProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/type/${productType}`);
        if (!res.ok) {
          throw new Error("Error al obtener productos");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        setError(t("errorFetchingProducts"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productType, t]);

  if (loading) {
    return (
      <p className="text-gray-500 col-span-full text-center">
        {t("loadingProducts")}
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 col-span-full text-center">
        {error}
      </p>
    );
  }

  return (
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
  );
}
