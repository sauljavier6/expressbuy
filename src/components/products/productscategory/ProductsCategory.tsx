"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/productcard/productcard";

interface SizeStock {
  size: string;
  stock: number;
  color: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  gender: string;
  sizes: SizeStock[];
}

interface ProductsCategoryProps {
  category: string;
}

export default function ProductsCategory({ category }: ProductsCategoryProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/category/${category}?page=${page}&limit=8`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .catch(() => {
        setError(t("errorFetchingProducts"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, page, t]);
  

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
  
        {!loading && !error && products?.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            There are no products available.
          </p>
        )}
  
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            {"<<"}
          </button>

          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            {t("pagination.previous")}
          </button>

          {/* Renderizar números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded ${
                page === num ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            {t("pagination.next")}
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
      </div>
    );
  }
  