"use client";
// src/app/admin/dashboard.tsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/sidebar/SideBar";
import Category from "@/components/admin/category/Category";
import ProductType from "@/components/admin/producttype/ProductType";
import Products from "@/components/admin/product/addproduct/AddProduct";
import ListProducts from "@/components/admin/product/listproducts/ListProducts";
import AdminOrders from "@/components/admin/orders/Orders";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  const handleSelectSection = (section: string) => {
    setSelectedSection(section);
  };

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
          <Sidebar onSelect={handleSelectSection} setIsSidebarOpen={setIsSidebarOpen}/>
        </div>
      </div>
      
      <aside className="hidden md:block md:w-64 bg-gray-100 p-0">
        <Sidebar onSelect={handleSelectSection} />
      </aside>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden p-4"
      >
        <img src="/icons/more.png" alt="Menu" className="w-6 h-6" />
      </button>
      <main className="w-full md:w-3/4 container mx-auto p-6">
        {selectedSection === "Category" && <Category />}
        {selectedSection === "ProductType" && <ProductType />}
        {selectedSection === "Products" && <Products />}
        {selectedSection === "ListProducts" && <ListProducts />}
        {selectedSection === "Orders" && <AdminOrders />}
        {/* Aquí puedes agregar más condiciones para otras secciones */}
      </main>
    </div>
  );
}