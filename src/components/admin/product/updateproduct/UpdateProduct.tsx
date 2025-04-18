import { useEffect, useState } from "react";
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

interface UpdateProductProps {
  product: Product;
  onCancel: () => void;
  fetchProducts: () => void;
}

const UpdateProduct = ({ product, onCancel, fetchProducts }: UpdateProductProps) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

    useEffect(() => {
      fetchCategories();
      fetchProductTypes();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        setError("Error loading categories.");
      }
    };
  
    const fetchProductTypes = async () => {
      try {
        const res = await fetch("/api/producttype");
        const data = await res.json();
        setProductTypes(data);
      } catch (error) {
        setError("Error loading product types.");
      }
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setUpdatedProduct((prev) => ({ ...prev, [name]: file }));
    }
  };  

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
  
    if (!product._id) {
      setError("Error: Product ID not found.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("size", updatedProduct.size);
    formData.append("price", updatedProduct.price.toString());
    formData.append("category", updatedProduct.category);
    formData.append("productType", updatedProduct.productType);
    formData.append("stock", updatedProduct.stock.toString());
    formData.append("gender", updatedProduct.gender);
  
    // Si el usuario seleccionó una nueva imagen, añadirla
    if (updatedProduct.image) {
      formData.append("image", updatedProduct.image);
    }

    if (updatedProduct.imagedos) {
      formData.append("imagedos", updatedProduct.imagedos);
    }
    
  
    try {
      const res = await fetch(`/api/products/product/updateproduct/${updatedProduct._id}`, {
        method: "PUT",
        body: formData, // Enviar FormData
      });
  
      const data = await res.json();
  
      if (data.success) {
        alert("Product updated successfully.");
        fetchProducts();
        onCancel(); // Cerrar modal o limpiar formulario
      } else {
        setError("Error updating the product.");
      }
    } catch (error) {
      setError("Server connection error.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("createProduct.titleedit")}</h2> 
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.name")}</label>
          <input
            type="text"
            name="name"
            value={updatedProduct.name}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.size")}</label>
          <input
            type="text"
            name="size"
            value={updatedProduct.size}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.price")}</label>
          <input
            type="number"
            name="price"
            value={updatedProduct.price}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.stock")}</label>
          <input
            type="number"
            name="stock"
            value={updatedProduct.stock}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.category")}</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">{t("createProduct.selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.productType")}</label>
          <select
            name="productType"
            value={product.productType}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">{t("createProduct.selectproductType")}</option>
            {productTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.gender")}</label>
          <select
            name="gender"
            value={updatedProduct.gender}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">{t("createProduct.selectCategory")}</option>
            <option value="H">{t("createProduct.men")}</option>
            <option value="M">{t("createProduct.women")}</option>
            <option value="O">{t("createProduct.boys")}</option>
            <option value="A">{t("createProduct.girls")}</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.image")}</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChangeFile}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t("createProduct.image")}</label>
          <input
            type="file"
            name="imagedos"
            accept="image/*"
            onChange={handleChangeFile}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button type="submit" disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
        {loading ? t("createProduct.saving") : t("createProduct.buttonedit")}
        </button>
        <button type="button" onClick={onCancel} className="ml-2 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
        {t("createProduct.cancel")}  
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
