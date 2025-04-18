import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    doc.text("Order Invoice", 10, 20);
  
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 10, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 40);
    doc.text(`Total: $${order.total.toFixed(2)}`, 10, 50);
    doc.text(`Status: ${order.status}`, 10, 60);
    doc.text(`Shipping Address: ${order.address}`, 10, 70);
  
    doc.line(10, 80, 200, 80);
    doc.text("Product Details:", 10, 90);
  
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
  
        doc.text(`Product: ${item.productId.name}`, 10, y + 5);
        doc.text(`Quantity: ${item.quantity}`, 10, y + 15);
        doc.text(`Price: $${(item.productId.price * item.quantity).toFixed(2)}`, 10, y + 25);
  
        doc.addImage(imageData, "JPEG", 150, y, 40, 40);
  
        y += 50;
      }
  
      doc.text("Thank you for your purchase!", 10, y + 10);
      doc.save(`${order._id}.pdf`);
    };
  
    processImagesAndSave();
  };
  

  if (loading) return <p className="text-center text-xl text-gray-500">Loading...</p>;

  if (!isClient) return null;

  return (
    <div className="admin-orders max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">{t("adminOrders.title")}</h1>

      {/* Buscador */}
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder={t("adminOrders.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-64"
        />
        <button
          onClick={fetchSearchResults}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {t("adminOrders.searchButton")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
            <th className="px-4 py-2 text-left">{t("adminOrders.orderId")}</th>
            <th className="px-4 py-2 text-left">{t("adminOrders.date")}</th>
            <th className="px-4 py-2 text-left">{t("adminOrders.total")}</th>
            <th className="px-4 py-2 text-left">{t("adminOrders.status")}</th>
            <th className="px-4 py-2 text-left">{t("adminOrders.actions")}</th>
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
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => generatePDF(order)}
                      className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      {t("adminOrders.printPDF")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                {t("adminOrders.noOrders")}
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
          Previous
        </button>
        <span className="text-lg">
          Page  {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
