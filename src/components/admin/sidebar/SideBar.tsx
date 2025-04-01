import { useState } from "react";

interface SidebarProps {
  onSelect: (section: string) => void;
}

export default function Sidebar({ onSelect }: SidebarProps) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <ul>
        <li className="mb-4">
          <button
            onClick={() => onSelect("Category")}
            className="text-lg text-white hover:bg-gray-700 p-2 w-full text-left"
          >
            Categorías
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => onSelect("ProductType")}
            className="text-lg text-white hover:bg-gray-700 p-2 w-full text-left"
          >
            Tipo de producto
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
            className="text-lg text-white hover:bg-gray-700 p-2 w-full text-left flex justify-between"
          >
            Productos
            <img
              src="/icons/down-arrow.png"
              alt="Flecha"
              className={`w-5 h-5 transition-transform duration-300 ${isSubmenuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isSubmenuOpen && (
            <ul className="ml-4 mt-2 bg-gray-700 rounded">
              <li>
                <button
                  onClick={() => onSelect("ListProducts")}
                  className="text-white hover:bg-gray-600 p-2 w-full text-left"
                >
                  Ver Todos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelect("Products")}
                  className="text-white hover:bg-gray-600 p-2 w-full text-left"
                >
                  Agregar Producto
                </button>
              </li>
            </ul>
          )}
        </li>
        <li className="mb-4">
          <button
            onClick={() => onSelect("Orders")}
            className="text-lg text-white hover:bg-gray-700 p-2 w-full text-left"
          >
            Pedidos
          </button>
        </li>
      </ul>
    </div>
  );
}
