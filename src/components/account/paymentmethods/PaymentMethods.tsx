// src/components/PaymentMethods.tsx
interface PaymentMethodsProps {
  paymentMethods: Array<{
    cardType: string;
    last4: string;
  }>;
}

const PaymentMethods = ({ paymentMethods }: PaymentMethodsProps) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Métodos de Pago</h2>
    {paymentMethods.map((method, index) => (
      <div key={index} className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">{method.cardType}</span>: **** **** **** {method.last4}
        </p>
        <div className="mt-2 space-x-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition">
            Editar Método de Pago
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition">
            Eliminar Método de Pago
          </button>
        </div>
      </div>
    ))}
    <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition">
      Agregar Nuevo Método de Pago
    </button>
  </div>
);

export default PaymentMethods;
