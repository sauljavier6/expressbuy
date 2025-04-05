import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    const addresses = await Address.find({ userId: user._id }).lean();

    // 🔹 Obtener los últimos 10 pedidos ordenados de la más nueva a la más vieja
    const orders = await Order.find({ userId: user._id })
      .populate({
        path: "items",
        populate: { path: "productId", model: "Product" },
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .limit(10) // Limitar a los últimos 10 pedidos
      .lean();

    return new Response(JSON.stringify({ user, addresses, orders }), { status: 200 });
  } catch (error) {
    console.error("Error en API user:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}

