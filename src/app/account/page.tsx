'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PersonalInfo from '../../components/account/personalinfo/PersonalInfo';
import AddressInfo from '../../components/account/addressinfo/AddressInfo';
import PaymentMethods from '../../components/account/paymentmethods/PaymentMethods';
import OrdersHistory from '../../components/account/ordershistory/OrdersHistory';
import { fetchUserData } from '../../services/userService';

interface PersonalInfo {
  name: string;
  email: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}  

interface PaymentMethod {
  cardType: string;
  last4: string;
}  

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
}

interface UserData {
  personalInfo: PersonalInfo;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
}

const AccountPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserData(user.id)
        .then(data => {
          if (data) {
            const formattedData: UserData = {
              personalInfo: {
                name: data.name || 'No disponible',
                email: data.email || 'No disponible',
              },
              addresses: data.addresses || [],
              paymentMethods: data.paymentMethods || [],
              orders: data.orders || [],
            };
            setUserData(formattedData);
          }
        })
        .catch(error => console.error('Error al obtener los datos del usuario:', error));
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Por favor, inicia sesión para acceder a tu cuenta.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">No se pudo obtener la información del usuario.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mi Cuenta</h1>

        {userData ? (
          <div className="grid gap-6">
            <PersonalInfo user={userData.personalInfo} />
            <AddressInfo addresses={userData.addresses} />
            <PaymentMethods paymentMethods={userData.paymentMethods} />
            <OrdersHistory orders={userData.orders} />
          </div>
        ) : (
          <p className="text-gray-500 text-center">Cargando información de la cuenta...</p>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
