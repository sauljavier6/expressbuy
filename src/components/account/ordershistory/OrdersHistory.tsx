// src/components/OrdersHistory.tsx
interface OrdersHistoryProps {
  orders: Array<{
    id: string;
    date: string;
    status: string;
    total: number;
  }>;
}

const OrdersHistory = ({ orders }: OrdersHistoryProps) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Pedidos</h2>
    {orders.map((order, index) => (
      <div key={index} className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Pedido #{order.id}</span>
        </p>
        <p className="text-gray-600">Fecha: {order.date}</p>
        <p className="text-gray-600">Estado: {order.status}</p>
        <p className="text-gray-600">Total: ${order.total}</p>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition">
            Ver Detalles
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default OrdersHistory;
