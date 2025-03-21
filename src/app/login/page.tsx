"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // Importa el icono de Google

const AuthPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center animate-fadeIn">
        {session ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bienvenido, {session.user?.name}</h2>
            <p className="text-gray-600 mt-2">Redirigiendo al inicio...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
            <p className="text-gray-600 mt-2">Accede con tu cuenta de Google</p>
            <button
              onClick={() => signIn("google")}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition"
            >
              <FcGoogle className="text-xl" /> {/* Icono de Google */}
              Iniciar sesión con Google
            </button>
          </div>
        )}
      </div>

      {/* Animación de entrada */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
