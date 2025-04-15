"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/cartcontext/CartContext";
import { useTranslation } from "react-i18next"; 

interface Product {
  _id: string;
  name: string;
  size: string;
  price: number;
  image: string;
  imagedos: string;
  stock: number;
  gender: string;
}

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const { t } = useTranslation();
  const { addToCart, getProductQuantity } = useCart();
  const quantity = product ? getProductQuantity(product._id) : 0;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/productdetails/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.image) {
          setMainImage(data.image);
        }
      })
      .catch((error) => console.error("Error al obtener producto:", error));
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity < product.stock) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  if (!product) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  if (!isClient) return null;

  const outOfStock = quantity >= product.stock;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galería de Imágenes */}
        <div className="flex flex-col">
          <img
            src={mainImage}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-lg w-full object-cover border"
          />

          {/* Miniaturas */}
          <div className="flex gap-4 mt-4">
            {[product.image, product.imagedos].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Miniatura ${index}`}
                width={100}
                height={100}
                className={`rounded-lg border cursor-pointer hover:opacity-80 ${
                  img === mainImage ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info del producto */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-700 mb-2">{t("Products.price")}: <span className="font-semibold">${product.price}</span></p>
            <p className="text-gray-600 mb-1">{t("Products.size")}: {product.size}</p>
            <p className="text-gray-600 mb-1">{t("Products.stockAvailable")}: {product.stock}</p>
            <p className="text-gray-600 mb-1">{t("Products.gender")}: {product.gender}</p>

            {quantity > 0 && (
              <p className="text-sm text-blue-500 mt-2">
                {t("Products.inCart")}: {quantity}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`mt-6 px-6 py-3 rounded-lg transition w-fit ${
              outOfStock
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={outOfStock}
          >
            {outOfStock ? t("Products.outOfStock") : t("Products.addToCart")} 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
