// src/pages/success.jsx o success.js
"use client";

import { useEffect } from "react";
import { useCart } from "@/context/cartcontext/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-green-100">
      <h1 className="text-4xl font-bold text-green-600">✅ ¡Gracias por tu compra!</h1>
      <p className="mt-4 text-xl text-gray-700">Tu pago se ha procesado exitosamente.</p>
    </div>
  );
}
