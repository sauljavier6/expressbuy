"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { cart, clearCart, deliveryAddress, user } = useCart();
  const router = useRouter();
  const { t } = useTranslation();

  const [isClient, setIsClient] = useState(false);
  const [storedId, setStoredId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const SHIPPING_COST = 6;


  useEffect(() => {
    setIsClient(true);
  
    const id = localStorage.getItem("userId");
    setStoredId(id);
  
    // Calcular total del carrito + envío
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(subtotal + SHIPPING_COST);
  }, [cart]);

  if (!isClient || storedId === null) return null; // Prevenir errores de SSR

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  const handleStripeCheckout = async () => {
    const stripe = await stripePromise;
    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total,
        deliveryAddress,
        user,
        storedId
      }),
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
                <span>{item.name} #{item.size} (x{item.quantity})</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-right text-sm text-gray-700">
          {t("CheckoutPage.shippingCost")}: ${SHIPPING_COST.toFixed(2)}
        </p>

        <p className="text-lg font-bold text-right mb-6">
          {t("CheckoutPage.total")}: ${total.toFixed(2)}
        </p>

        {/* PayPal */}
        <div className="flex justify-center mb-4">
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
            <PayPalButtons
              style={{
                layout: "horizontal",
                shape: "pill",
                color: "blue",
                height: 44,
              }}
              createOrder={async () => {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ total }),
                });

                const data = await res.json();
                return data.id;
              }}
              onCancel={(data) => {
                console.log("Payment canceled:", data);
              }}
              onApprove={async (data) => {
                try {
                  const res = await fetch("/api/checkout/paypal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderId: data.orderID,
                      items: cart,
                      total,
                      deliveryAddress,
                      user,
                      storedId,
                    }),
                  });

                  const result = await res.json();

                  if (result.success) {
                    clearCart();
                    router.push("/account");
                  } else {
                    console.error("Error capturing order:", result.error);
                  }
                } catch (err) {
                  console.error("Failure in onApprove:", err);
                }
              }}
            />
          </PayPalScriptProvider>
        </div>

        {/* Stripe */}
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
