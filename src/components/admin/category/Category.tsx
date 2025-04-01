"use client";
import { useState, useEffect } from "react";

export default function CreateCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  console.log(categories);

  // Fetch all categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      } else {
        setError("Error cargando las categorías.");
      }
    } catch (error) {
      setError("Error al comunicarse con el servidor.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    const categoryData = { name: categoryName };

    try {
      let response;
      if (editingCategoryId) {
        // Update category if editing
        response = await fetch(`/api/categories/categories/${editingCategoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Create category if new
        response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Categoría guardada:", data);
        setCategoryName(""); // Limpiar el campo después de crear o actualizar
        setEditingCategoryId(null); // Limpiar la categoría en edición
        // Refetch categories
        fetchCategories();
      } else {
        setError("Error creando/actualizando la categoría.");
      }
    } catch (error) {
      setError("Error al comunicarse con el servidor.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (categoryId: string, categoryName: string) => {
    setEditingCategoryId(categoryId);
    setCategoryName(categoryName);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        const response = await fetch(`/api/categories/categories/${categoryId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Categoría eliminada exitosamente");
          // Refetch categories after deletion
          fetchCategories();
        } else {
          setError("Error al eliminar la categoría.");
        }
      } catch (error) {
        setError("Error al comunicarse con el servidor.");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Crear/Editar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="categoryName">
            Nombre de la Categoría
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={handleCategoryChange}
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
          {loading ? "Guardando..." : editingCategoryId ? "Actualizar Categoría" : "Crear Categoría"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-6">Categorías Existentes</h2>
      <ul className="mt-4">
        {categories.length === 0 ? (
          <li>No hay categorías disponibles.</li>
        ) : (
          categories.map((category) => (
            <li key={category._id} className="flex justify-between items-center py-2">
              <span>{category.name}</span>
              <div>
                <button
                  onClick={() => handleEditCategory(category._id, category.name)}
                  className="ml-4 text-blue-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
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
  );
}
