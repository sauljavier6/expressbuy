import { connectDB } from "@/lib/db";
import { ProductType } from "@/models/ProductType";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { _id: string } }) {
    const objectId = params._id;
    await connectDB();
    
    const data = await req.json();
    
    try {
      const producttype = await ProductType.findByIdAndUpdate(objectId, data, { new: true });
      if (!producttype) {
        return NextResponse.json({ error: "Tipo de producto no encontrado" }, { status: 404 });
      }
      return NextResponse.json(producttype, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Error actualizando tipo de producto" }, { status: 500 });
    }
  }

  export async function DELETE(req: Request, { params }: { params: { _id: string } }) {
    const objectId = params._id;
    await connectDB();
  
    try {
      // Buscar la categoría y eliminarla
      const producttype = await ProductType.findByIdAndDelete(objectId);
  
      if (!producttype) {
        return NextResponse.json({ error: "Tipo de producto no encontrado" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Tipo de producto eliminado exitosamente" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Error eliminando tipo de producto" }, { status: 500 });
    }
  }