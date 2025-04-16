"use client";

import { useTranslation } from "react-i18next";  
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IFeaturedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  gender: string;
}

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<IFeaturedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch("/api/banner/featuredproducts"); // Asegúrate de que este endpoint existe
        const data = await res.json();
        setProducts(data.latestProducts);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const handleCardClick = (productId: string) => {
    router.push(`/products/productdetails/${productId}`);
  };  

  if (!isClient) return <h2 className="text-2xl text-center">Loading...</h2>;

  return (
    <section className="py-12 px-6 md:px-12">
      <h2 className="text-2xl font-semibold text-center">{t("featured")}</h2>
      <p className="text-gray-500 text-center mb-6">{t("featuredDescription")}</p>

      {isLoading ? (
        <p className="text-center">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} onClick={() => handleCardClick(product._id)} className="border rounded-lg p-4 shadow-md bg-white relative">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md"/>
              </div>
              <p className="text-xs text-gray-500 mt-2">{product.size}</p>
              <h3 className="text-sm font-semibold">{product.name}</h3>
              <p className="text-lg font-bold text-red-600">${product.price.toFixed(2)}</p>
              <Link href="#" passHref>
                <button className="mt-2 bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition">
                  {t("Products.addToCart")} 🛒
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
