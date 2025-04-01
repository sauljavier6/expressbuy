"use client";
// src/app/admin/dashboard.tsx
import { useState } from "react";
import Sidebar from "@/components/admin/sidebar/SideBar";
import Category from "@/components/admin/category/Category";
import ProductType from "@/components/admin/producttype/ProductType";
import Products from "@/components/admin/product/addproduct/AddProduct";
import ListProducts from "@/components/admin/product/listproducts/ListProducts";

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState<string>("");

  const handleSelectSection = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <div className="flex">
      <Sidebar onSelect={handleSelectSection} />
      <div className="flex-1 p-6">
        {selectedSection === "Category" && <Category />}
        {selectedSection === "ProductType" && <ProductType />}
        {selectedSection === "Products" && <Products />}
        {selectedSection === "ListProducts" && <ListProducts />}
        {/* Aquí puedes agregar más condiciones para otras secciones */}
      </div>
    </div>
  );
}