// src/pages/success.jsx o success.js
"use client";

import { useEffect } from "react";
import { useCart } from "@/context/cartcontext/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1>✅ ¡Gracias por tu compra!</h1>
      <p>Tu pago se ha procesado exitosamente.</p>
    </div>
  );
}
