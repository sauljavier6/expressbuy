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

interface ProductsCategoryProps {
  category: string;
}

export default async function ProductsCategory({ category }: ProductsCategoryProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(products)
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/category/${category}`);
        const data = await res.json();
  
        //if (!res.ok) throw new Error(data.message);
        console.log("Producto recibido:", data);
        setProducts(data)
      } catch (error) {
        console.error("Error al obtener producto:", error);
      }
    };
  
    fetchProduct();
  }, [category]);


  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">
        {t("productsTitle")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
