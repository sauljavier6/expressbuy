// src/components/CreateProductType.tsx
"use client";
import { useState, useEffect } from "react";

export default function CreateProductType() {
  const [productTypeName, setProductTypeName] = useState("");
  const [productTypes, setProductTypes] = useState<{ _id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingProductTypeId, setEditingProductTypeId] = useState<string | null>(null);

  // Fetch all product types from the API
  const fetchProductTypes = async () => {
    try {
      const response = await fetch("/api/producttype");
      const data = await response.json();
      if (response.ok) {
        setProductTypes(data);
      } else {
        setError("Error cargando los tipos de productos.");
      }
    } catch (error) {
      setError("Error al comunicarse con el servidor.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const handleProductTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductTypeName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productTypeName) {
      setError("El nombre del tipo de producto es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    const productTypeData = { name: productTypeName };

    try {
      let response;
      if (editingProductTypeId) {
        // Update product type if editing
        response = await fetch(`/api/producttype/producttype/${editingProductTypeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productTypeData),
        });
      } else {
        // Create product type if new
        response = await fetch("/api/producttype", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productTypeData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Tipo de producto guardado:", data);
        setProductTypeName(""); // Limpiar el campo después de crear o actualizar
        setEditingProductTypeId(null); // Limpiar el tipo de producto en edición
        fetchProductTypes();
      } else {
        setError("Error creando/actualizando el tipo de producto.");
      }
    } catch (error) {
      setError("Error al comunicarse con el servidor.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProductType = (productTypeId: string, productTypeName: string) => {
    setEditingProductTypeId(productTypeId);
    setProductTypeName(productTypeName);
  };

  const handleDeleteProductType = async (productTypeId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este tipo de producto?")) {
      try {
        const response = await fetch(`/api/producttype/producttype/${productTypeId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Tipo de producto eliminado exitosamente");
          fetchProductTypes();
        } else {
          setError("Error al eliminar el tipo de producto.");
        }
      } catch (error) {
        setError("Error al comunicarse con el servidor.");
        console.error("Error:", error);
      }
    }
  };

  return ( 
    <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Crear/Editar Tipo de Producto</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor="productTypeName">
          Nombre del Tipo de Producto
        </label>
        <input
          type="text"
          id="productTypeName"
          value={productTypeName}
          onChange={handleProductTypeChange}
          className="mt-2 p-2 border border-gray-300 rounded w-full"
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Guardando..." : editingProductTypeId ? "Actualizar Tipo de Producto" : "Crear Tipo de Producto"}
      </button>
    </form>

    <h2 className="text-2xl font-bold mt-6">Tipos de Producto Existentes</h2>
    <ul className="mt-4">
        {productTypes.length === 0 ? (
        <li>No hay tipos de producto disponibles.</li>
        ) : (
        productTypes.map((productType) => (
            <li key={productType._id} className="flex justify-between items-center py-2">
            <span>{productType.name}</span>
            <div>
                <button
                onClick={() => handleEditProductType(productType._id, productType.name)}
                className="ml-4 text-blue-500"
                >
                Editar
                </button>
                <button
                onClick={() => handleDeleteProductType(productType._id)}
                className="ml-4 text-red-500"
                >
                Eliminar
                </button>
            </div>
            </li>
        ))
        )}
        </ul>
    </div>
  )
}


