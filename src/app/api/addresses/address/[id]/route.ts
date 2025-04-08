import { connectDB } from "@/lib/db";
import { Address } from "@/models/Address";
import { NextResponse } from "next/server";

// Corregir el tipo de función GET y demás
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectDB();

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return NextResponse.json({ success: false, message: "Dirección no encontrada" });
    }

    return NextResponse.json({ success: true, message: "Dirección eliminada con éxito" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error eliminando la dirección", error });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    await connectDB();

    const existingAddress = await Address.findById(id);
    if (!existingAddress) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    const updatedAddress = await Address.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json({ message: "Dirección actualizada correctamente", address: updatedAddress }, { status: 201 });
  } catch (error) {
    console.error("Error al actualizar dirección:", error);
    return NextResponse.json({ error: "Error al actualizar la dirección" }, { status: 500 });
  }
}
