"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const BestSellerProducts = () => {
  const { t } = useTranslation(); 
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/banner/bestsellers', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data.bestSellingProducts);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  if (!isClient) {
    return <h2 className="text-2xl text-center">Loading...</h2>;
  }
 
  return (
    <section className="py-12 px-6 md:px-12">
      <h2 className="text-2xl font-semibold text-center">{t("bestSeller")}</h2>
      <p className="text-gray-500 text-center mb-6">{t("bestSellerDescription")}</p>

      {isLoading ? (
        <p className="text-center">Loading products...</p>
      ) : (
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
      )}
    </section>
  );
};

export default BestSellerProducts;
