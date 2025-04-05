interface OrdersHistoryProps {
  orders: Array<{
    _id: string;
    status: string;
    total: number;
    address: string;
    items: Array<{
      productId: {
        _id: string;
        sex: string;
        image: string;
      };
      name: string;
      price: number;
      quantity: number;
      talla: string;
    }>;
  }>;
}

const OrdersHistory = ({ orders }: OrdersHistoryProps) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Pedidos</h2>
    {orders.map((order, index) => (
      <div key={order._id} className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Pedido #{order._id}</span>
        </p>
        <p className="text-gray-600">Estado: {order.status}</p>
        <p className="text-gray-600">Total: ${order.total}</p>
        <p className="text-gray-600">Dirección: {order.address}</p>

        {/* 🔥 Listado de productos en la orden */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">Productos:</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center border-t border-gray-200 pt-2 mt-2">
              <img src={item.productId.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div>
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-gray-600">Precio: ${item.price}</p>
                <p className="text-gray-600">Cantidad: {item.quantity}</p>
                <p className="text-gray-600">Talla: {item.talla}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default OrdersHistory;
