import { useEffect, useState } from "react";
import axios from "axios"; // Importa Axios
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

export default function ProductsCategory({ category }: ProductsCategoryProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Usamos axios para hacer la petición
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}api/products/category/${category}`)
      .then((response) => {
        setProducts(response.data); // Axios devuelve los datos en response.data
      })
      .catch((error) => {
        setError(t("errorFetchingProducts"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, t]);

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("productsTitle")}</h1>

      {loading && (
        <p className="text-gray-500 col-span-full text-center">Loading products...</p>
      )}

      {error && (
        <p className="text-red-500 col-span-full text-center">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500 col-span-full text-center">
          {t("noProducts")}
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
