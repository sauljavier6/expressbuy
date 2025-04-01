import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// 📌 GET: Obtener productos
export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

// 📌 POST: Agregar producto
export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("image") as File;
  const name = data.get("name");
  const price = parseFloat(data.get("price") as string);
  const talla = data.get("talla");
  const category = data.get("category");
  const productType = data.get("productType");
  const stock = parseInt(data.get("stock") as string, 10);
  const sex = data.get("sex");

  if (!file || !name || !price || !talla || !category || !productType || !stock || !sex) {
    return NextResponse.json({ success: false, msg: "Faltan datos necesarios" });
  }

  // 📌 Generar nombre único para la imagen
  const newFilename = `${uuidv4()}.${file.name.split(".").pop()}`;
  const uploadDir = path.join(process.cwd(), "public", "products"); // 📌 Ahora en `public/products/`

  await mkdir(uploadDir, { recursive: true });

  const newFilePath = path.join(uploadDir, newFilename);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    await writeFile(newFilePath, buffer);

    // 📌 Guardar en la base de datos (guardamos la ruta relativa)
    const newProduct = await Product.create({
      name,
      price,
      talla,
      category,
      productType,
      stock,
      sex,
      image: `/products/${newFilename}`, // Ruta accesible desde el frontend
    });

    return NextResponse.json({ success: true, product: newProduct, msg: "success" });
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json({ success: false, msg: "Error saving product" });
  }
}
