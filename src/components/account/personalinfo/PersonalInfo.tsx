// src/components/PersonalInfo.tsx
interface PersonalInfoProps {
  user: {
    name: string;
    email: string;
  };
}

const PersonalInfo = ({ user }: PersonalInfoProps) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 mb-3">Información Personal</h2>
    <p className="text-gray-700"><span className="font-medium">Nombre:</span> {user.name}</p>
    <p className="text-gray-700"><span className="font-medium">Correo Electrónico:</span> {user.email}</p>
    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition">
      Editar Información
    </button>
  </div>
);

export default PersonalInfo;
