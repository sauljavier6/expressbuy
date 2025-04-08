import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";  // Asegúrate de importar desde el lugar correcto
import { Address } from "@/models/Address";
import Order from "@/models/Order";
import "@/models/OrderItem";
import "@/models/Product";

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
    console.error("Error al crear el usuario:", error);
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}

// 📌 GET: Obtener la información del usuario y sus pedidos
export async function GET(req: Request) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener la sesión del usuario con NextAuth
    const session = await getServerSession(authOptions);

    // Si no hay sesión o el usuario no está autenticado
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Buscar el usuario en la base de datos
    const user = await User.findById(session.user.id);

    // Si el usuario no existe
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Obtener las direcciones del usuario
    const addresses = await Address.find({ userId: user._id }).lean();

    // Obtener los últimos 10 pedidos del usuario, ordenados de la más nueva a la más vieja
    const orders = await Order.find({ userId: user._id })
      .populate({
        path: "items",
        populate: { path: "productId", model: "Product" },
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 })
      .limit(10) // Limitar a los últimos 10 pedidos
      .lean();

    // Responder con los datos del usuario, direcciones y pedidos
    return NextResponse.json({ user, addresses, orders }, { status: 200 });
  } catch (error) {
    console.error("Error en API user:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
