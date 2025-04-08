import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Correo y contraseña obligatorios" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
