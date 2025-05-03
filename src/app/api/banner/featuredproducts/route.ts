import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Buscar los productos más recientes ordenados por fecha de creación
    const latestProducts = await Product.find({})
      .sort({ createdAt: -1 }) // Ordenar descendente (más recientes primero)
      .limit(4); // Limitar a los 6 más recientes

    return NextResponse.json({ latestProducts }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener productos recientes:", error);
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}
