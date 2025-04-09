"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/products/sidebar/SideBar";
import Products from "@/components/products/products/Products";
import ProductsCategory from "@/components/products/productscategory/ProductsCategory";
import ProductTypeProducts from "@/components/products/productstype/ProductsType";

export default function Page() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const productTypeIdFromUrl = searchParams.get("productTypeId");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Estado local para almacenar selección manual (ejemplo: sidebar interna)
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [productTypeId, setProductTypeId] = useState<string | null>(null);

  // Sincroniza la URL con el estado local cuando cambia
  useEffect(() => {
    if (categoryIdFromUrl) {
      setCategoryId(categoryIdFromUrl);
      setProductTypeId(null); // Evita conflictos
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
  

  // Determina qué componente mostrar
  let ContentComponent;
  if (categoryId) {
    ContentComponent = <ProductsCategory category={categoryId} />;
  } else if (productTypeId) {
    ContentComponent = <ProductTypeProducts productType={productTypeId} />;
  } else {
    ContentComponent = <Products />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } md:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`w-64 bg-white h-full p-6 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar setCategoryId={setCategoryId} setProductTypeId={setProductTypeId} setIsSidebarOpen={setIsSidebarOpen} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-1/4 bg-gray-100 p-6">
        <Sidebar setCategoryId={setCategoryId} setProductTypeId={setProductTypeId} />
      </aside>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden p-4"
      >
        <img src="/icons/more.png" alt="Menu" className="w-6 h-6" />
      </button>
      <main className="w-full md:w-3/4 container mx-auto p-6">{ContentComponent}</main>
    </div>
  );
}
