"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart, deliveryAddress, user } = useCart();
  const router = useRouter();
  const [total, setTotal] = useState(0);

  const storedId = localStorage.getItem("userId");

  useEffect(() => {
    const calculatedTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, [cart]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

        {/* Lista de productos */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Detalles de la compra:</h2>
          <ul className="border rounded-lg p-4 bg-gray-50">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <span>{item.name} (x{item.quantity})</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-lg font-bold text-right mb-6">Total: ${total.toFixed(2)}</p>

        {/* PayPal Buttons */}
        <div className="flex justify-center">
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
              <PayPalButtons
                createOrder={async() => {
                  const orderData = {
                    items: cart,
                    total,
                    deliveryAddress, 
                    user,
                    storedId
                  };

                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                  });

                  const order = await res.json()
                  return order.id
                }}
                onCancel={(data) => {
                  console.log('Cancelled:',data)
                }}
                onApprove={async (data, actions) => {
                  const order = await actions.order?.capture();

                  if(order?.status === "COMPLETED"){
                    clearCart();
                    router.push("/account");
                  }

                  
                }}
              />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
