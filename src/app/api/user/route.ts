import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

// 📌 GET: Obtener información del usuario
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // Obtenemos el userId de los parámetros de la URL

  if (!userId) {
    return NextResponse.json({ error: "userId es requerido" }, { status: 400 });
  }

  try {
    await connectDB(); // Conectar a la base de datos antes de realizar la consulta

    // Buscar al usuario por el userId
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user); // Devolver la información del usuario en formato JSON
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    return NextResponse.json({ error: "Error al obtener los datos del usuario" }, { status: 500 });
  }
}


// 📌 POST: Agregar un nuevo usuario
export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    // Verificar si ya existe un usuario con el mismo correo
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    const newUser = await User.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}
