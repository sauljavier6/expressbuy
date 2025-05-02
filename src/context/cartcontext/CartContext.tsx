"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  size: string;
  color: string;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  clearCart: () => void;
  getProductQuantity: (id: string, size: string, color: string) => number;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  user: { name: string, email: string; };
  setUser: (user: {name: string, email: string; }) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [user, setUser] = useState<{ name: string, email: string;  }>({ name: "", email: "" });
  const [isInitialized, setIsInitialized] = useState(false);


  // Cargar carrito y dirección de entrega desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (err) {
        console.error("Error al leer el carrito del localStorage", err);
      }
    }
    setIsInitialized(true); // importante
  }, []);   

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);
  

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      // Buscar por ID y TALLA
      const existingItem = prevCart.find(
        (item) => item._id === product._id && item.size === product.size && item.color === product.color
      );
  
      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          return prevCart.map((item) =>
            item._id === product._id &&
            item.size === product.size &&
            item.color === product.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ); 
        } else {
          alert("No hay suficiente stock disponible");
          return prevCart;
        }
      } else {
        // Agregar nueva combinación de producto + talla
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };  
  
  const removeFromCart = (id: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id && item.size === size && item.color === color) {
            return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null;
          }
          return item;
        })
        .filter((item) => item !== null) as CartItem[]
    );
  };   

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getProductQuantity = (id: string, size: string, color: string): number => {
    const item = cart.find((item) => item._id === id && item.size === size && item.color === color);
    return item ? item.quantity : 0;
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
        user,
        setUser
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
