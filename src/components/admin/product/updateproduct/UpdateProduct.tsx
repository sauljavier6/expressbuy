import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Size {
  size: string;
  stock: string;
}

interface Product {
  _id: string;
  name: string;
  sizes: Size[];
  price: number;
  category: string;
  productType: string;
  gender: string;
  image: any;
  imagedos: any;
}

interface UpdateProductProps {
  product: Product;
  onCancel: () => void;
  fetchProducts: () => void;
}

export default function UpdateProduct({ product, onCancel, fetchProducts }: UpdateProductProps){
  const [updatedProduct, setUpdatedProduct] = useState<Product>({ ...product });
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
    fetchProductTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Error loading categories.");
    }
  };

  const fetchProductTypes = async () => {
    try {
      const res = await fetch("/api/producttype");
      const data = await res.json();
      setProductTypes(data);
    } catch {
      setError("Error loading product types.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUpdatedProduct(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSizeChange = (index: number, field: keyof Size, value: string) => {
    const newSizes = [...updatedProduct.sizes];
    newSizes[index][field] = value;
    setUpdatedProduct(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleAddSize = () => {
    setUpdatedProduct(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: "" }],
    }));
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = updatedProduct.sizes.filter((_, i) => i !== index);
    setUpdatedProduct(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    console.log("updatedProduct:",updatedProduct)
    e.preventDefault();

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("sizes", JSON.stringify(updatedProduct.sizes));
    formData.append("price", updatedProduct.price.toString());
    formData.append("category", updatedProduct.category);
    formData.append("productType", updatedProduct.productType);
    formData.append("gender", updatedProduct.gender);

    if (updatedProduct.image) formData.append("image", updatedProduct.image);
    if (updatedProduct.imagedos) formData.append("imagedos", updatedProduct.imagedos);

    try {
      const res = await fetch(`/api/products/product/updateproduct/${updatedProduct._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully.");
        window.dispatchEvent(new Event("productsUpdated"));
        fetchProducts();
        onCancel();
      } else {
        setError("Error updating the product.");
      }
    } catch {
      setError("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("createProduct.titleedit")}</h2>
      <form onSubmit={handleUpdate}>
        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.name")}</label>
          <input
            type="text"
            name="name"
            value={updatedProduct.name}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Tallas y stocks */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.size")}</label>
          {updatedProduct.sizes.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Size"
                value={item.size}
                onChange={(e) => handleSizeChange(idx, "size", e.target.value)}
                className="p-2 border rounded w-1/2"
              />
              <input
                type="number"
                placeholder="Stock"
                value={item.stock}
                onChange={(e) => handleSizeChange(idx, "stock", e.target.value)}
                className="p-2 border rounded w-1/2"
              />
              <button type="button" onClick={() => handleRemoveSize(idx)} className="text-red-500 font-bold">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSize} className="text-sm text-blue-500 mt-1">
            + {t("createProduct.addSize")}
          </button>
        </div>

        {/* Precio */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.price")}</label>
          <input
            type="number"
            name="price"
            value={updatedProduct.price}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.category")}</label>
          <select
            name="category"
            value={updatedProduct.category}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
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

        {/* Tipo de producto */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.productType")}</label>
          <select
            name="productType"
            value={updatedProduct.productType}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
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

        {/* Género */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.gender")}</label>
          <select
            name="gender"
            value={updatedProduct.gender}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          >
            <option value="">{t("createProduct.selectCategory")}</option>
            <option value="H">{t("createProduct.men")}</option>
            <option value="M">{t("createProduct.women")}</option>
            <option value="O">{t("createProduct.boys")}</option>
            <option value="A">{t("createProduct.girls")}</option>
          </select>
        </div>

        {/* Imagen */}
        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.image")}</label>
          <input type="file" name="image" accept="image/*" onChange={handleChangeFile} className="mt-2 w-full" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">{t("createProduct.image")}</label>
          <input type="file" name="imagedos" accept="image/*" onChange={handleChangeFile} className="mt-2 w-full" />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
