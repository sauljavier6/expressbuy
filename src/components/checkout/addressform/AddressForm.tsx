import { useState } from "react";

export default function AddressForm({ onSubmit }: { onSubmit: (address: any) => void }) {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (e: any) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Dirección de Envío</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="street"
          placeholder="Calle y número"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={address.street}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={address.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="Estado / Provincia"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={address.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="zip"
          placeholder="Código Postal"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={address.zip}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="País"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={address.country}
          onChange={handleChange}
          required
        />
      </div>
      
      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Guardar Dirección
      </button>
    </form>
  );
}
