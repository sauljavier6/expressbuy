"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartcontext/CartContext";

export default function Page() {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    clearCart();

    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000); // 3 segundos

    return () => clearTimeout(timeout); // Limpia el timeout si se desmonta antes
  }, [clearCart, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-green-100">
      <h1 className="text-4xl font-bold text-green-600">✅ ¡Gracias por tu compra!</h1>
      <p className="mt-4 text-xl text-gray-700">Tu pago se ha procesado exitosamente.</p>
      <p className="mt-2 text-sm text-gray-500">Serás redirigido al inicio en unos segundos...</p>
    </div>
  );
}
