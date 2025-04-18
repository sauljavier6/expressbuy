"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // Alternar entre login y registro
  const [error, setError] = useState<string | null>(null);  // Para manejar errores
  const router = useRouter();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsClient(true);
    if (session) {
      const userId = session.user?.id;
      const userName = session.user?.name;
      const userEmail = session.user?.email;

      if (userId && userName && userEmail) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);
      }

      setTimeout(() => {
        router.push("/"); // Redirigir después de login exitoso
      }, 2000);
    }
  }, [session, router]);

  if (!isClient) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        setError("Credenciales incorrectas, por favor revisa tu correo o contraseña.");
      } else {
        setError(null);
        console.log("Login exitoso:", result);
      
        const updatedSession = await getSession();
        console.log("🟢 Sesión actualizada:", updatedSession);
      
      }      
    } catch (err) {
      console.error("Error:", err);
      setError("Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Hubo un error al crear la cuenta. Inténtalo nuevamente.");
      } else {
        setError(null);
        setIsRegister(false);
      }
    } catch (err) {
      console.error("Error al crear la cuenta:", err);
      setError("Hubo un problema al registrar la cuenta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center animate-fadeIn">
        {session ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t("Login.welcome")}, {session.user?.name}</h2>
            <p className="text-gray-600 mt-2">{t("Login.redirecting")}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800">
              {isRegister ? t("Login.createAccount") : t("Login.login")}
            </h2>
            <p className="text-gray-600 mt-2">
            {isRegister
                ? t("Login.fillForm")
                : t("Login.loginOrGoogle")}
            </p>

            {/* Botón Google */}
            <button
              onClick={handleGoogleSignIn}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow hover:bg-gray-200 transition"
              disabled={loading}
            >
              <FcGoogle className="text-xl" />
              {loading ? t("Login.loading") : t("Login.continueWithGoogle")}
            </button>

            {/* Separador */}
            <div className="my-4 border-t border-gray-300 relative">
              <span className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-400 text-sm">
                o
              </span>
            </div>

            {/* Formulario manual */}
            <form onSubmit={isRegister ? handleRegister : handleSubmit} className="space-y-4 text-left">
              {isRegister && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
              >
                {loading
                  ? t("Login.loading")
                  : isRegister
                  ? t("Login.createAccount")
                  : t("Login.login")}
              </button>
            </form>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <p className="text-sm text-gray-500 mt-4">
              {isRegister ? t("Login.alreadyHaveAccount") : t("Login.dontHaveAccount")}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-indigo-600 hover:underline"
              >
                {isRegister ? t("Login.signIn") : t("Login.registerNow")}
              </button>
            </p>
          </>
        )}
      </div>

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
