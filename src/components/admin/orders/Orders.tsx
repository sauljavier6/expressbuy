import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

interface OrderItem {
  productId: { _id: string; name: string; price: number; image: string };
  quantity: number;
}

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  address: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?page=${currentPage}`);
      const data = await response.json();
      console.log(data)
      setOrders(data.orders);
      setFilteredOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    if (searchTerm.trim() === "") {
      fetchOrders();
      return;
    }

    try {
      const res = await fetch(`/api/orders/order/${searchTerm}`);
      const data = await res.json();
      if (!data.order) {
        console.warn("No se encontró la orden.");
        return;
      }
      setFilteredOrders([data.order]);
      
    } catch (error) {
      console.error("Error al buscar la orden:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleChangeStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/order/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la orden:", error);
    }
  };

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Factura de Orden", 10, 20);

    doc.setFontSize(12);
    doc.text(`Orden ID: ${order._id}`, 10, 30);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 40);
    doc.text(`Total: $${order.total.toFixed(2)}`, 10, 50);
    doc.text(`Estado: ${order.status}`, 10, 60);
    doc.text(`Dirección de entrega: ${order.address}`, 10, 70);

    doc.line(10, 80, 200, 80);
    doc.text("Detalles de productos:", 10, 90);

    let y = 100;

    const loadImage = (url: string): Promise<string> =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
        img.src = url;
      });

    const processImagesAndSave = async () => {
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const imageData = await loadImage(item.productId.image);

        doc.text(`Producto: ${item.productId.name}`, 10, y + 5);
        doc.text(`Cantidad: ${item.quantity}`, 10, y + 15);
        doc.text(`Precio: $${(item.productId.price * item.quantity).toFixed(2)}`, 10, y + 25);

        doc.addImage(imageData, "JPEG", 150, y, 40, 40);

        y += 50;
      }

      doc.text("Gracias por su compra!", 10, y + 10);
      doc.save(`${order._id}.pdf`);
    };

    processImagesAndSave();
  };

  if (loading) return <p className="text-center text-xl text-gray-500">Cargando...</p>;

  return (
    <div className="admin-orders max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Órdenes Pagadas</h1>

      {/* Buscador */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por ID de orden..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-64"
        />
        <button
          onClick={fetchSearchResults}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Pedido ID</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">${order.total}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        order.status === "paid"
                          ? "bg-blue-500"
                          : order.status === "shipped"
                          ? "bg-yellow-500"
                          : order.status === "delivered"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                      className="bg-gray-100 border border-gray-300 rounded-lg p-2"
                    >
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                    <button
                      onClick={() => generatePDF(order)}
                      className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Imprimir PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No se encontraron órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination mt-6 flex justify-between items-center text-gray-700">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-lg">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
