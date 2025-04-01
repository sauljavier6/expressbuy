// src/hooks/useAuth.ts
import { useSession } from 'next-auth/react';

interface AuthUser {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  }  

export const useAuth = () => {
  const { data: session } = useSession();

  // Verifica si la sesión existe y agrega la propiedad 'id'
  const user: AuthUser | null = session?.user ? { 
    id: session.user.id!,  // O cualquier otro campo que sirva como identificador
    name: session.user.name,
    email: session.user.email,
    image: session.user.image
  } : null;

  const isAuthenticated = !!user;

  return { user, isAuthenticated };
};
