"use client";
import { useState, useEffect } from "react";

export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    size: "",
    price: "",
    category: "",
    productType: "",
    image: null as File | null,
    imageTwo: null as File | null,
    stock: "",
    gender: "",
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<{ _id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // If the field is "price" or "stock", convert it to a number
    const newValue = ["price", "stock"].includes(name) ? Number(value) || 0 : value;
  
    setProduct({ ...product, [name]: newValue });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setProduct((prev) => ({
      ...prev,
      [name]: file,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("size", product.size);
    formData.append("price", product.price.toString());
    formData.append("category", product.category);
    formData.append("productType", product.productType);
    formData.append("stock", product.stock.toString());
    formData.append("gender", product.gender);
  
    if (product.image) {
      formData.append("image", product.image);
    }
  
    if (product.imageTwo) {
      formData.append("imageTwo", product.imageTwo);
    }
  
    try {
      const res = await fetch("/api/products/product", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.msg === "success") {
        alert("Product created successfully.");
        setProduct({
          name: "",
          size: "",
          price: "",
          category: "",
          productType: "",
          image: null,
          imageTwo: null,
          stock: "",
          gender: "",
        });
      } else {
        setError("Error creating product.");
      }
    } catch (error) {
      setError("Connection error with the server.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <input
            type="text"
            name="size"
            value={product.size}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <select
            name="productType"
            value={product.productType}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select a type</option>
            {productTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={product.gender}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select</option>
            <option value="H">Men</option>
            <option value="M">Women</option>
            <option value="O">Boys</option>
            <option value="A">Girls</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChangeFile}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="imageTwo"
            accept="image/*"
            onChange={handleChangeFile}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded" disabled={loading}>
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
