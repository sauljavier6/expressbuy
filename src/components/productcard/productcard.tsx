"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface SizeStock {
  size: string;
  stock: number;
}

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  gender: string;
  sizes: SizeStock[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/productdetails/${product._id}`);
  };

  return (
    <div
      className="border p-4 rounded shadow hover:shadow-lg transition"
      onClick={handleDetailsClick}
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <p className="text-sm text-gray-500">{t("Products.gender")}: {product.gender}</p>

      {/* Mostrar tallas disponibles */}
      <div className="mt-2 text-sm text-gray-700">
        <strong>{t("Products.size")}:</strong>{" "}
        {product.sizes?.map(({ size }) => size).join(", ")}
      </div>

      {/* Botón de detalles */}
      <button
        onClick={handleDetailsClick}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {t("Products.details")}
      </button>
    </div>
  );
}
