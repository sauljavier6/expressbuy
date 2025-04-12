// app/products/product/ProductClientPage.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/products/sidebar/SideBar";
import Products from "@/components/products/products/Products";
import ProductsCategory from "@/components/products/productscategory/ProductsCategory";
import ProductTypeProducts from "@/components/products/productstype/ProductsType";

type Props = {
  categoryIdFromUrl: string | null;
  productTypeIdFromUrl: string | null;
};

export default function ProductClientPage({
  categoryIdFromUrl,
  productTypeIdFromUrl,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [productTypeId, setProductTypeId] = useState<string | null>(null);

  console.log('product client',categoryIdFromUrl)
  console.log('product client',productTypeIdFromUrl)

  useEffect(() => {
    if (categoryIdFromUrl) {
      setCategoryId(categoryIdFromUrl);
      setProductTypeId(null);
    }
    if (productTypeIdFromUrl) {
      setProductTypeId(productTypeIdFromUrl);
      setCategoryId(null);
    }

    return () => {
      setCategoryId(null);
      setProductTypeId(null);
    };
  }, [categoryIdFromUrl, productTypeIdFromUrl]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`w-64 bg-white h-full p-6 transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar
            setCategoryId={setCategoryId}
            setProductTypeId={setProductTypeId}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </div>

      <aside className="hidden md:block md:w-1/4 bg-gray-100 p-6">
        <Sidebar
          setCategoryId={setCategoryId}
          setProductTypeId={setProductTypeId}
        />
      </aside>

      <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-4">
        <img src="/icons/more.png" alt="Menu" className="w-6 h-6" />
      </button>
      <main className="w-full md:w-3/4 container mx-auto p-6">
        {/* Forzar carga con ID fijo */}
        <ProductsCategory category="67e302992f121b2eb4f7ff26" />

        {/* Comentado por ahora
        {categoryId && <ProductsCategory category={categoryId} />}
        {productTypeId && !categoryId && (<ProductTypeProducts productType={productTypeId} /> )}
        {!categoryId && !productTypeId && <Products />}
        */}
      </main>

    </div>
  );
}
