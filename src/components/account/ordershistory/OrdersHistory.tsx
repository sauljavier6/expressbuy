import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
      size: string;
    }>;
  }>;
}

const OrdersHistory = ({ orders }: OrdersHistoryProps) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  
  return (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("ordersHistory.title")}</h2>
    {orders.map((order, index) => (
      <div key={order._id} className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">{t("ordersHistory.order")} #{order._id}</span>
        </p>
        <p className="text-gray-600">{t("ordersHistory.status")}: {order.status}</p>
        <p className="text-gray-600">{t("ordersHistory.total")}: ${order.total}</p>
        <p className="text-gray-600">{t("ordersHistory.address")}: {order.address}</p>

        {/* 🔥 Listado de productos en la orden */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">{t("ordersHistory.products")}:</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center border-t border-gray-200 pt-2 mt-2">
              <img src={item.productId.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div>
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-gray-600">{t("ordersHistory.price")}: ${item.price}</p>
                <p className="text-gray-600">{t("ordersHistory.quantity")}: {item.quantity}</p>
                <p className="text-gray-600">{t("ordersHistory.size")}: {item.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};

export default OrdersHistory;
