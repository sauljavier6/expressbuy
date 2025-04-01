// src/components/AddressInfo.tsx
interface AddressInfoProps {
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
}

const AddressInfo = ({ addresses }: AddressInfoProps) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Direcciones</h2>
    {addresses.map((address, index) => (
      <div key={index} className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-gray-700">{address.street}</p>
        <p className="text-gray-600">
          {address.city}, {address.state}, {address.zipCode}
        </p>
        <div className="mt-4 space-x-4">
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition">
            Editar Dirección
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition">
            Eliminar Dirección
          </button>
        </div>
      </div>
    ))}
    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition mt-4">
      Agregar Nueva Dirección
    </button>
  </div>
);

export default AddressInfo;

  