import { useState } from "react";

interface Address {
  _id?: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressInfoProps {
  addresses: Address[];
  onUpdate: (updatedAddresses: Address[]) => void;
}

export default function AddressInfo({ addresses, onUpdate }: AddressInfoProps) {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Address>({
    userId: "", street: "", city: "", state: "", zip: "", country: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await fetch(`/api/addresses/address/${id}`, { method: "DELETE" });

      onUpdate(addresses.filter((addr) => addr._id !== id));
    } catch (error) {
      console.error("Error al eliminar dirección", error);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress ? `/api/addresses/address/${editingAddress._id}` : "/api/addresses";
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Error en la solicitud:", data.error || "Error desconocido");
        alert(data.error || "Error al guardar la dirección");
        return;
      }
  
      if (!data.address) {
        alert(data.message || "No se recibió una dirección válida.");
        return;
      }
  
      if (editingAddress) {
        onUpdate(addresses.map((addr) => (addr._id === editingAddress._id ? data.address : addr)));
      } else {
        onUpdate([...addresses, data.address]);
      }
  
      closeModal();
    } catch (error) {
      console.error("Error al guardar dirección", error);
      alert("Ocurrió un error al guardar la dirección.");
    }
  };
  

  const storedId = localStorage.getItem("userId");

  const openModal = (address?: Address) => {
    setEditingAddress(address || null);
    setFormData(address || { userId: storedId || "", street: "", city: "", state: "", zip: "", country: "" });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Direcciones</h2>
      {addresses.map((address, index) => (
        <div key={address._id} className="border-b border-gray-300 pb-4 mb-4">
          <p className="text-gray-700">{address.street}</p>
          <p className="text-gray-600">{address.city}, {address.state}, {address.zip}</p>
          <div className="mt-4 space-x-4">
            <button onClick={() => openModal(address)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Editar</button>
            <button onClick={() => handleDelete(address._id)} className="px-4 py-2 bg-red-600 text-white rounded-md">Eliminar</button>
          </div>
        </div>
      ))}
      <button onClick={() => openModal()} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md mt-4">Agregar Nueva Dirección</button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingAddress ? "Editar Dirección" : "Agregar Dirección"}
            </h3>

            <div className="space-y-3">
              <input className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Calle" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} />
              <input className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ciudad" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              <input className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Estado" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              <input className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Código Postal" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} />
              <input className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="País" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
            </div>

            <div className="flex justify-end space-x-3 mt-5">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.street || !formData.city || !formData.state || !formData.zip || !formData.country}
                className={`px-4 py-2 rounded-lg transition ${
                  !formData.street || !formData.city || !formData.state || !formData.zip || !formData.country
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
