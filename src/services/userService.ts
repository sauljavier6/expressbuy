// userService.ts

// Simulamos una llamada a una API para obtener los datos del usuario.
export const fetchUserData = async (userId: string) => {
    // Lógica para obtener los datos del usuario, por ejemplo, a través de una llamada a la API.
    const response = await fetch(`/api/user?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }
    return response.json();
  };
  