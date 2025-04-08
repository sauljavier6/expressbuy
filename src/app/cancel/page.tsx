// src/pages/cancel.jsx o cancel.js
export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">❌ Pago cancelado</h1>
      <p className="mt-4 text-xl text-gray-700">Tu transacción fue cancelada. Puedes intentarlo nuevamente cuando gustes.</p>
    </div>
  );
}
