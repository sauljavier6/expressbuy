"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressForm from "@/components/checkout/addressform/AddressForm";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, setDeliveryAddress } = useCart();
  const router = useRouter();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);



  const handleCheckout = (newAddress: any) => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip || !newAddress.country) {
      alert("Por favor, completa todos los campos de la dirección.");
      return;
    }

    setDeliveryAddress(JSON.stringify(newAddress));
    setDisabledSubmit(false);
  };

  const submit = () => {
    router.push("/checkout");
  }


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Tu Carrito</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center bg-white shadow-lg p-4 rounded-lg">
              <img src={item.image} width={80} height={80} alt={item.name} className="rounded-lg" />
              <div className="ml-6 flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-gray-700 font-medium">Cantidad: {item.quantity}</p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                onClick={() => removeFromCart(item._id)}
              >
                ❌
              </button>
            </div>
          ))}

          {!showAddressForm ? (
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition w-full"
              onClick={() => setShowAddressForm(true)}
            >
              📍 Continuar con la compra
            </button>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-md">
              <h3 className="text-lg font-semibold mb-3">📦 Dirección de entrega</h3>

              <AddressForm onSubmit={handleCheckout} />

              <div className="flex flex-col sm:flex-row sm:justify-between mt-6">
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition w-full sm:w-auto"
                  onClick={submit}
                  disabled ={disabledSubmit}
                >
                  🛍 Ir a pagar
                </button>
                <button
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition w-full sm:w-auto mt-4 sm:mt-0"
                  onClick={() => setShowAddressForm(false)}
                >
                  🔙 Volver al carrito
                </button>
              </div>
            </div>
          )}

          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition w-full"
            onClick={clearCart}
          >
            🗑 Vaciar carrito
          </button>
        </div>
      )}
    </div>
  );
}
