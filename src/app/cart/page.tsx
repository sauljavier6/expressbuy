"use client";

import { useCart } from "@/context/cartcontext/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center border-b py-4">
              <Image src={item.image} width={80} height={80} alt={item.name} className="rounded-md" />
              <div className="ml-4 flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price}</p>
                <p>Cantidad: {item.quantity}</p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded"
                onClick={() => removeFromCart(item._id)}
              >
                Eliminar
              </button>
            </div>
          ))}
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded mr-4" onClick={clearCart}>
            Continue shopping
          </button>
          <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={clearCart}>
            Empty Cart
          </button>
        </div>
      )}
    </div>
  );
}
