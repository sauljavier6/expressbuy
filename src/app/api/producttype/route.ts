import { connectDB } from "@/lib/db";
import { ProductType } from "@/models/ProductType"; // Asegúrate de tener este modelo
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const producttype = await ProductType.find();
    return NextResponse.json(producttype);
  } catch (error) {
    console.error("Error al obtener los tipos de producto:", error);
    return NextResponse.json(
      { error: "Error al obtener los tipos de producto" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();
    
    try {
      const newProductType = await ProductType.create(data);
      return NextResponse.json(newProductType, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Error creating category" }, { status: 500 });
    }
  }
  