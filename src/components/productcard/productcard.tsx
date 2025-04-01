"use client";

import { useCart } from "@/context/cartcontext/CartContext";

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart, getProductQuantity } = useCart();
  const quantity = getProductQuantity(product._id);

  return (
    <div className="border p-4 rounded shadow">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <p className="text-sm text-gray-500">Stock disponible: {product.stock}</p>

      {/* 🔹 Mostrar la cantidad agregada */}
      {quantity > 0 && <p className="text-sm text-blue-500">En carrito: {quantity}</p>}

      <button
        className={`px-4 py-2 rounded mt-2 ${
          quantity < product.stock ? "bg-green-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={() => addToCart({ ...product, quantity: 1 })}
        disabled={quantity >= product.stock} // 🔹 Evitar agregar más de lo disponible
      >
        {quantity < product.stock ? "Añadir al Carrito" : "Sin Stock"}
      </button>
    </div>
  );
}
