

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

interface ProductsTypeProps {
  productType: string;
}

export default function ProductsType({ productType }: ProductsTypeProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('productType fuera del usefect', productType)

  useEffect(() => {
    fetch(`/api/products/producttype/${productType}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        setError(t("errorFetchingProducts"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productType,t]);

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

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500 col-span-full text-center">
          There are no products available.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
