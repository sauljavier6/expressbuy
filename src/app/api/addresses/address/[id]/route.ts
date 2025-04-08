import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db"; 
import { Address } from "@/models/Address";
import { NextResponse } from "next/server";


export async function GET(req: Request, context: Promise<{ params: { id: string } }>) {
  try {
    const id = (await (await context).params).id;

    // 🔹 Validación del ID
    if (!id || id.trim() === "") {
      return NextResponse.json({ success: false, message: "ID de usuario inválido" }, { status: 400 });
    }

    await connectDB();
    const addresses = await Address.find({ userId: id });

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: Promise<{ params: { id: string } }>) {
  

  if (req.method === "DELETE") {
    try {
      
      const id = (await (await context).params).id;
      await connectDB();

      
      const deletedAddress = await Address.findByIdAndDelete(id);

      if (!deletedAddress) {
        return NextResponse.json({ success: false, message: "Dirección no encontrada" });
      }

      return NextResponse.json({ success: true, message: "Dirección eliminada con éxito" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error eliminando la dirección", error });
    }
  } else {
    return NextResponse.json({ success: false, message: "Método no permitido" });
  }
}


export async function PUT(req: Request, context: Promise<{ params: { id: string } }>) {
  try {
    await connectDB();
    const id = (await (await context).params).id;
    const data = await req.json();

    // Verificar si la dirección existe
    const existingAddress = await Address.findById(id);
    if (!existingAddress) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    // Actualizar los campos de la dirección
    const updatedAddress = await Address.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json({ message: "Dirección actualizada correctamente", address: updatedAddress }, { status: 201 });
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    return NextResponse.json({ error: "Error al actualizar la dirección" }, { status: 500 });
  }
}
