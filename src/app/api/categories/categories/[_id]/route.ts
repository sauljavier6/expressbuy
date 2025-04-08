import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category"; // Asegúrate de tener este modelo
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ _id: string }> }) {
  const { _id } = await params; // Desestructuración correcta
  await connectDB();

  const data = await req.json();

  try {
    const category = await Category.findByIdAndUpdate(_id, data, { new: true });
    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error actualizando categoría" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ _id: string }> }) {
  const { _id } = await params; // Desestructuración correcta
  await connectDB();

  try {
    // Buscar la categoría y eliminarla
    const category = await Category.findByIdAndDelete(_id);

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoría eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error eliminando categoría" }, { status: 500 });
  }
}