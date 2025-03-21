"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/productcard/productcard";

// Definir la estructura del producto
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data)) // Especificamos el tipo de datos
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Nuestros Productos</h1>
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
