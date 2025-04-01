"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getProductQuantity: (id: string) => number;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");

  // Cargar carrito y dirección de entrega desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedAddress = localStorage.getItem("deliveryAddress");
    if (savedAddress) {
      setDeliveryAddress(savedAddress);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Guardar dirección de entrega en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("deliveryAddress", deliveryAddress);
  }, [deliveryAddress]);

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

  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null;
          }
          return item;
        })
        .filter((item) => item !== null) as CartItem[] // Filtramos elementos nulos
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getProductQuantity = (id: string) => {
    return cart.find((item) => item._id === id)?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getProductQuantity,
        deliveryAddress,
        setDeliveryAddress,
      }}
    >
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
