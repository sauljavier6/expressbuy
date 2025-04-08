import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// 📌 PUT: Actualizar producto
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = await params;

  try {
    const data = await req.formData();
    const file = data.get("image") as File | null;
    const file2 = data.get("imagedos") as File | null;
    const name = data.get("name");
    const price = data.get("price") ? parseFloat(data.get("price") as string) : undefined;
    const talla = data.get("talla");
    const category = data.get("category");
    const productType = data.get("productType");
    const stock = data.get("stock") ? parseInt(data.get("stock") as string, 10) : undefined;
    const sex = data.get("sex");

    const updateFields: any = { name, price, talla, category, productType, stock, sex };

    // 📌 Si hay una imagen nueva, guardarla
    if (file && file.size > 0) {
      const newFilename = `${uuidv4()}.${file.name.split(".").pop()}`;
      const uploadDir = path.join(process.cwd(), "public", "products");

      await mkdir(uploadDir, { recursive: true });

      const newFilePath = path.join(uploadDir, newFilename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(newFilePath, buffer);
      updateFields.image = `/products/${newFilename}`;
    }

    if (file2 && file2.size > 0) {
      const newFilename2 = `${uuidv4()}.${file2.name.split(".").pop()}`;
      const uploadDir = path.join(process.cwd(), "public", "products");
    
      await mkdir(uploadDir, { recursive: true });
    
      const newFilePath2 = path.join(uploadDir, newFilename2);
      const bytes2 = await file2.arrayBuffer();
      const buffer2 = Buffer.from(bytes2);
    
      await writeFile(newFilePath2, buffer2);
      updateFields.imagedos = `/products/${newFilename2}`;
    }

    // 📌 Filtrar campos undefined para no sobrescribir valores existentes
    Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, msg: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct, msg: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json({ success: false, msg: "Error al actualizar el producto" }, { status: 500 });
  }
}
