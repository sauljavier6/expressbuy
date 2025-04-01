"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { components } from "@paypal/paypal-js/types/apis/openapi/checkout_orders_v2";

export default function CheckoutPage() {
  const { cart, clearCart, deliveryAddress } = useCart();
  const router = useRouter();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, [cart]);

  const handlePaymentSuccess = async (details: { create_time?: components["schemas"]["date_time"]; update_time?: components["schemas"]["date_time"]; } & { id?: string; payment_source?: components["schemas"]["payment_source_response"]; intent?: components["schemas"]["checkout_payment_intent"]; processing_instruction?: components["schemas"]["processing_instruction"]; payer?: components["schemas"]["payer"]; purchase_units?: components["schemas"]["purchase_unit"][]; status?: components["schemas"]["order_status"]; links?: readonly components["schemas"]["link_description"][]; }) => {
        console.log("submit")
    const orderData = {
      items: cart,
      total,
      paymentId: details.id,
      status: details.status,
    };

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      /*clearCart();
      router.push("/order-success");*/
      console.log('llego')
    } else {
      alert("Payment failed. Please try again.");
    }
  };

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
                  const res = await fetch('/api/checkout', {
                    method: "POST"
                  })
                  const order = await res.json()
                  console.log(order)
                  return order.id
                }}
                onCancel={(data) => {
                  console.log('Cancelled:',data)
                }}
                onApprove={async (data, actions) => {
                  console.log(data)
                  actions.order?.capture()
                }}
              />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
