import { authOptions } from "@/app/utils/authOptions"; // Asegúrate de importar correctamente
import NextAuth from "next-auth";

// Crear el manejador con NextAuth usando la configuración importada
const handler = NextAuth(authOptions);

// Exportar los métodos GET y POST de la ruta
export { handler as GET, handler as POST };
