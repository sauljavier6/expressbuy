"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number; // 🔹 Asegurar que manejamos el stock
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void; // Eliminar uno del carrito
  clearCart: () => void; // Vaciar carrito
  getProductQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar el carrito desde localStorage cuando se monta el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          return prevCart.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          alert("No hay suficiente stock disponible");
          return prevCart;
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 🛑 Eliminar un solo producto, o restar 1 a la cantidad
  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item._id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;
          }
        }
        return item;
      }).filter((item) => item !== null); // Filtramos los items nulos (eliminados)
    });
  };

  // 🛑 Vaciar el carrito completamente
  const clearCart = () => {
    setCart([]);
  };

  // 🔹 Obtener la cantidad actual de un producto en el carrito
  const getProductQuantity = (id: string) => {
    return cart.find((item) => item._id === id)?.quantity || 0;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getProductQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
