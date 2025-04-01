import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  talla: string;
  price: number;
  category: string;
  productType: string;
  stock: number;
  sex: string;
  image: any;
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
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setUpdatedProduct({ ...updatedProduct, image: file });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
  
    if (!product._id) {
      setError("Error: No se encontró el ID del producto.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("talla", updatedProduct.talla);
    formData.append("price", updatedProduct.price.toString());
    formData.append("category", updatedProduct.category);
    formData.append("productType", updatedProduct.productType);
    formData.append("stock", updatedProduct.stock.toString());
    formData.append("sex", updatedProduct.sex);
  
    // Si el usuario seleccionó una nueva imagen, añadirla
    if (updatedProduct.image) {
      formData.append("image", updatedProduct.image);
    }
  
    try {
      const res = await fetch(`/api/products/product/updateproduct/${updatedProduct._id}`, {
        method: "PUT",
        body: formData, // Enviar FormData
      });
  
      const data = await res.json();
  
      if (data.success) {
        alert("Producto actualizado correctamente.");
        fetchProducts();
        onCancel(); // Cerrar modal o limpiar formulario
      } else {
        setError("Error al actualizar el producto.");
      }
    } catch (error) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
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
          <label className="block text-sm font-medium text-gray-700">Talla</label>
          <input
            type="text"
            name="talla"
            value={updatedProduct.talla}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Precio</label>
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
          <label className="block text-sm font-medium text-gray-700">Stock</label>
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
          <label className="block text-sm font-medium text-gray-700">Sexo</label>
          <select
            name="sex"
            value={updatedProduct.sex}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
            <option value="U">Unisex</option>
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
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button type="submit" disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
        {loading ? "Guardando..." : "Guardar cambios"}
        </button>
        <button type="button" onClick={onCancel} className="ml-2 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
