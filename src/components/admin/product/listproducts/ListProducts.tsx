
import { useState, useEffect } from "react";
import UpdateProduct from "@/components/admin/product/updateproduct/UpdateProduct";
import { useTranslation } from "react-i18next"; 

interface Product {
    _id: string;
    name: string;
    size: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null>(null); // Producto a editar
  const itemsPerPage = 5;
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/product");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async (id: string) => {
    if (!confirm(t('productList.message'))) return;

    try {
      await fetch(`/api/products/product/deleteproduct/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (!isClient) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('productList.title')}</h2>

      {editProduct ? (
        <UpdateProduct product={editProduct} onCancel={() => setEditProduct(null)} fetchProducts={fetchProducts}/>
      ) : (
        <div>
          <div className="container mx-auto p-2">
            <h1 className="text-3xl font-bold mb-4 text-center">{t('productList.subtitle')}</h1>

            {currentProducts.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">{t('productList.noProducts')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
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

          {/* Paginación */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
