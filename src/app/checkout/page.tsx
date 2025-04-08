"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const { cart, clearCart, deliveryAddress, user } = useCart();
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  const storedId = localStorage.getItem("userId");

  useEffect(() => {
    setIsClient(true);
    const calculatedTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, [cart]);

  if (!isClient) return null; // Evita el error de hidratación

  //configuracion de stripe
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  const handleStripeCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total, deliveryAddress, user, storedId, paymentMethod: "stripe", }),
    });
    const session = await res.json();

    if (stripe) {
      stripe.redirectToCheckout({ sessionId: session.id });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">{t("CheckoutPage.checkoutTitle")}</h1>

        {/* Lista de productos */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">{t("CheckoutPage.orderDetails")}</h2>
          <ul className="border rounded-lg p-4 bg-gray-50">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <span>{item.name} (x{item.quantity})</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-lg font-bold text-right mb-6">{t("CheckoutPage.total")}: ${total.toFixed(2)}</p>
        {/* PayPal Buttons */}
        <div className="flex justify-center">
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
            <PayPalButtons
              style={{
                layout: "horizontal",
                shape: "pill",
                color: "blue",
                height: 44,
              }}
              createOrder={async () => {
                const orderData = {
                  items: cart,
                  total,
                  deliveryAddress,
                  user,
                  storedId,
                  paymentMethod: "paypal",
                };

                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(orderData),
                });

                const order = await res.json();
                return order.id;
              }}
              onCancel={(data) => {
                console.log("Cancelled:", data);
              }}
              onApprove={async (data, actions) => {
                const order = await actions.order?.capture();

                if (order?.status === "COMPLETED") {
                  clearCart();
                  router.push("/account");
                }
              }}
            />
          </PayPalScriptProvider>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mt-4 w-full"
            onClick={handleStripeCheckout}
          >
            {t("CheckoutPage.payWithStripe")}
          </button>
        </div>
      </div>
    </div>
  );
}
