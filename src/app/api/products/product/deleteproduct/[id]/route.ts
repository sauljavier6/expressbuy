import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// 📌 DELETE: Eliminar un producto por ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, msg: "Producto no encontrado" }, { status: 404 });
    }

    await product.deleteOne();
    return NextResponse.json({ success: true, msg: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ success: false, msg: "Error al eliminar el producto" }, { status: 500 });
  }
}
