"use client";
import { useState, useEffect } from "react";

export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    talla: "",
    price: "",
    category: "",
    productType: "",
    image: null as File | null,
    imagedos: null as File | null,
    stock: "",
    sex: "",
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
      setError("Error al cargar las categorías.");
    }
  };

  const fetchProductTypes = async () => {
    try {
      const res = await fetch("/api/producttype");
      const data = await res.json();
      setProductTypes(data);
    } catch (error) {
      setError("Error al cargar los tipos de producto.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Si el campo es "price" o "stock", convertirlo a número
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
    formData.append("talla", product.talla);
    formData.append("price", product.price.toString());
    formData.append("category", product.category);
    formData.append("productType", product.productType);
    formData.append("stock", product.stock.toString());
    formData.append("sex", product.sex);
  
    if (product.image) {
      formData.append("image", product.image);
    }
  
    if (product.imagedos) {
      formData.append("imagedos", product.imagedos);
    }
  
    try {
      const res = await fetch("/api/products/product", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.msg === "success") {
        alert("Producto creado exitosamente.");
        setProduct({
          name: "",
          talla: "",
          price: "",
          category: "",
          productType: "",
          image: null,
          imagedos: null,
          stock: "",
          sex: "",
        });
      } else {
        setError("Error al crear el producto.");
      }
    } catch (error) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
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
          <label className="block text-sm font-medium text-gray-700">Talla</label>
          <input
            type="text"
            name="talla"
            value={product.talla}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Precio</label>
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
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tipo de Producto</label>
          <select
            name="productType"
            value={product.productType}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Selecciona un tipo</option>
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
            name="sex"
            value={product.sex}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Seleccionar</option>
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
            <option value="O">Niño</option>
            <option value="A">Niña</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Imagen</label>
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
          <label className="block text-sm font-medium text-gray-700">Imagen</label>
          <input
            type="file"
            name="imagedos"
            accept="image/*"
            onChange={handleChangeFile}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded" disabled={loading}>
          {loading ? "Guardando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
