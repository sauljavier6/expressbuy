"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; 

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart, getProductQuantity } = useCart();
  const router = useRouter();
  const quantity = getProductQuantity(product._id);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCardClick = () => {
    router.push(`/products/productdetails/${product._id}`);
  };

  if (!isClient) return null;

  return ( 
    <div
      className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
      onClick={handleCardClick}
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <p className="text-sm text-gray-500">{t("Products.stockAvailable")}:  {product.stock}</p>

      {quantity > 0 && <p className="text-sm text-blue-500">{t("Products.inCart")}: {quantity}</p>}

      <button
        className={`px-4 py-2 rounded mt-2 ${
          quantity < product.stock
            ? "bg-green-500 text-white"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={(e) => {
          e.stopPropagation(); // ⛔ Para evitar que el clic afecte al contenedor
          addToCart({ ...product, quantity: 1 });
        }}
        disabled={quantity >= product.stock}
      >
        {quantity < product.stock ? t("Products.addToCart") : t("Products.outOfStock")}
      </button>
    </div>
  );
}
