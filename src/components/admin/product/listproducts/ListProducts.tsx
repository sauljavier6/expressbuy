import { useState, useEffect } from "react";
import UpdateProduct from "@/components/admin/product/updateproduct/UpdateProduct";
import { useTranslation } from "react-i18next"; 

interface Size {
  size: string;
  stock: string;
  color?: string;
}

interface Product {
  _id: string;
  name: string;
  sizes: Size[];
  price: number;
  category: string;
  productType: string;
  stock: number;
  gender: string;
  image: any;
  imagedos: any;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/product?page=${page}&limit=8`);
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(t("errorFetchingProducts"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('productList.message'))) return;
    try {
      await fetch(`/api/products/product/deleteproduct/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product._id !== id));
      window.dispatchEvent(new Event("productsUpdated"));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!isClient) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('productList.title')}</h2>

      {editProduct ? (
        <UpdateProduct product={editProduct} onCancel={() => setEditProduct(null)} fetchProducts={fetchProducts} />
      ) : (
        <div>
          <div className="container mx-auto p-2">
            <h1 className="text-3xl font-bold mb-4 text-center">{t('productList.subtitle')}</h1>

            {loading ? (
              <p className="text-gray-500 col-span-full text-center">{t("loadingProducts")}</p>
            ) : error ? (
              <p className="text-red-500 col-span-full text-center">{error}</p>
            ) : products?.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">{t('productList.noProducts')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                  <div key={product._id} className="border p-4 rounded-lg shadow-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>

                    <div className="flex justify-between mt-3">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => setEditProduct(product)}
                      >
                        {t('productList.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        {t('productList.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              {"<<"}
            </button>
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              {t("pagination.previous")}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded ${page === num ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              >
                {num}
              </button>
            ))}

            <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              {t("pagination.next")}
            </button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
