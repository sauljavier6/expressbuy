import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";

// 📌 POST: Agregar producto
export async function POST(req: Request) {
  const data = await req.formData();
  const file1 = data.get("image") as File;
  const file2 = data.get("imageTwo") as File;

  const name = data.get("name");
  const price = parseFloat(data.get("price") as string);
  const size = data.get("size");
  const category = data.get("category");
  const productType = data.get("productType");
  const stock = parseInt(data.get("stock") as string, 10);
  const gender = data.get("gender");

  if (!name || !price || !size || !category || !productType || !stock || !gender) {
    return NextResponse.json({ success: false, msg: "Faltan datos necesarios" });
  }

  // 📌 Convertir archivos a base64
  const buffer1 = Buffer.from(await file1.arrayBuffer());
  const base64Image1 = `data:${file1.type};base64,${buffer1.toString("base64")}`;

  const buffer2 = Buffer.from(await file2.arrayBuffer());
  const base64Image2 = `data:${file2.type};base64,${buffer2.toString("base64")}`;

  try {
    await connectDB();

    // 📌 Subir imágenes a Cloudinary
    const upload1 = await cloudinary.uploader.upload(base64Image1, {
      folder: "products",
      public_id: uuidv4(),
    });

    const upload2 = await cloudinary.uploader.upload(base64Image2, {
      folder: "products",
      public_id: uuidv4(),
    });

    // 📌 Crear producto con URLs de Cloudinary
    const newProduct = await Product.create({
      name,
      price,
      size,
      category,
      productType,
      stock,
      gender,
      image: upload1.secure_url,
      imagedos: upload2.secure_url,
    });

    return NextResponse.json({ success: true, product: newProduct, msg: "success" });
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json({ success: false, msg: "Error saving product" });
  }
}
