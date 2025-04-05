'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PersonalInfo from '../../components/account/personalinfo/PersonalInfo';
import AddressInfo from '@/components/account/addressinfo/AddressInfo';
import OrdersHistory from '@/components/account/ordershistory/OrdersHistory';

interface user {
  name: string;
  email: string;
}

interface product {
  _id: string;
  sex: string;
  image: string;
}

interface OrderItem {
  productId: product;
  name: string,
  price: number,
  quantity: number,
  talla: string,
}

interface orders {
  _id: string;
  total: number;
  status: string;
  items: OrderItem[];
  address: string
}

interface Address {
  userId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface UserData {
  user: user;
  orders: orders[];
  addresses: Address[]; // 🔥 Ahora es un array
}

const AccountPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 📌 Cargar datos del usuario
  const loadUserData = async () => {
    try {
      if (!isAuthenticated) return;

      setLoading(true);

      const response = await fetch(`/api/user`);
      const data = await response.json();
      console.log(data)
      setUserData({
        user: {
          name: data.user.name || "No disponible",
          email: data.user.email || "No disponible",
        },
        addresses: Array.isArray(data.addresses) ? data.addresses : [], // 🔥 Asegurar que sea un array,
        orders: Array.isArray(data.orders) ? data.orders : [],
      });
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleupdate = (updatedAddresses: Address[]) => {
    setUserData((prev) => prev ? { ...prev, addresses: updatedAddresses } : null);
  };
  

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">
          Por favor, inicia sesión para acceder a tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mi Cuenta</h1>

        {loading ? (
          <p className="text-gray-500 text-center">
            Cargando información de la cuenta...
          </p>
        ) : userData ? (
          <div className="grid gap-6">
            <PersonalInfo user={userData.user} />
            <AddressInfo addresses={userData.addresses} onUpdate={handleupdate}/>
            <OrdersHistory orders={userData.orders} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No se encontró información del usuario.
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
