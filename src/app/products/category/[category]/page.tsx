"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/productcard/productcard";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function CategoryPage() {
  const { category } = useParams(); // Obtiene el parámetro de la URL
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!category) return;

    fetch(`/api/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [category]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <p className="text-gray-500">Cargando productos...</p>
        )}
      </div>
    </div>
  );
}
