// src/types/next-auth.d.ts
import NextAuth from "next-auth";
import { User as DBUser } from "@/models/User"; // Ajusta la ruta a tu modelo

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DBUser {} // Asegura que el tipo User esté correctamente configurado
}
