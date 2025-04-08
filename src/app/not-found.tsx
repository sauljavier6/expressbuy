// src/app/not-found.tsx

"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Página no encontrada</h1>
      <p className="text-lg text-gray-700 mb-6">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
