// src/components/CreateProductType.tsx
"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; 

export default function CreateProductType() {
  const [productTypeName, setProductTypeName] = useState("");
  const [productTypes, setProductTypes] = useState<{ _id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingProductTypeId, setEditingProductTypeId] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch all product types from the API
  const fetchProductTypes = async () => {
    try {
      const response = await fetch("/api/producttype");
      const data = await response.json();
      if (response.ok) {
        setProductTypes(data);
      } else {
        setError("Error loading product types.");
      }
    } catch (error) {
      setError("Error communicating with the server.");
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
      setError("Product type name is required.");
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
        console.log("Product type saved:", data);
        setProductTypeName(""); // Clear the field after creating or updating
        setEditingProductTypeId(null); // Clear the editing product type
        fetchProductTypes();
      } else {
        setError("Error creating/updating the product type.");
      }
    } catch (error) {
      setError("Error communicating with the server.");
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
    if (window.confirm("Are you sure you want to delete this product type?")) {
      try {
        const response = await fetch(`/api/producttype/producttype/${productTypeId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Product type deleted successfully");
          fetchProductTypes();
        } else {
          setError("Error deleting the product type.");
        }
      } catch (error) {
        setError("Error communicating with the server.");
        console.error("Error:", error);
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t("createEditProductType")}e</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="productTypeName">
          {t("productTypeName")}
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
          {loading ? t("saving") : editingProductTypeId ? t("updateProductType") : t("createProductType")}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-6">{t("existingProductTypes")}</h2>
      <ul className="mt-4">
        {productTypes.length === 0 ? (
          <li>{t("noProductTypes")}</li>
        ) : (
          productTypes.map((productType) => (
            <li key={productType._id} className="flex justify-between items-center py-2">
              <span>{productType.name}</span>
              <div>
                <button
                  onClick={() => handleEditProductType(productType._id, productType.name)}
                  className="ml-4 text-blue-500"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleDeleteProductType(productType._id)}
                  className="ml-4 text-red-500"
                >
                  {t("delete")}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
