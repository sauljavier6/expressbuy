import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import { Address } from "@/models/Address"; 


export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Datos no proporcionados" }, { status: 400 });
    }

    // Verificar si la dirección ya existe
    const existingAddress = await Address.findOne({
      userId: data.userId,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
    });

    if (existingAddress) {
      return NextResponse.json({ message: "La dirección ya existe", address: existingAddress }, { status: 200 });
    }

    // Crear la nueva dirección
    const newAddress = await Address.create({
      userId: data.userId,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
    });

    return NextResponse.json({ message: "Dirección creada con éxito", address: newAddress }, { status: 201 });

  } catch (error) {
    console.error("Error al guardar la dirección:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


