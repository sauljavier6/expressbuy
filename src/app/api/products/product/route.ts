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
  console.log(data)

  const file1 = data.get("image") as File;
  const file2 = data.get("imageTwo") as File;

  const name = data.get("name");
  const price = parseFloat(data.get("price") as string);
  const talla = data.get("talla");
  const category = data.get("category");
  const productType = data.get("productType");
  const stock = parseInt(data.get("stock") as string, 10);
  const sex = data.get("sex");

  if (!file1 || !file2 || !name || !price || !talla || !category || !productType || !stock || !sex) {
    console.log('faltan datos')
    return NextResponse.json({ success: false, msg: "Faltan datos necesarios" });
  }

  const uploadDir = path.join(process.cwd(), "public", "products");
  await mkdir(uploadDir, { recursive: true });

  // 📌 Procesar imagen 1
  const filename1 = `${uuidv4()}.${file1.name.split(".").pop()}`;
  const filepath1 = path.join(uploadDir, filename1);
  const buffer1 = Buffer.from(await file1.arrayBuffer());
  await writeFile(filepath1, buffer1);

  // 📌 Procesar imagen 2
  const filename2 = `${uuidv4()}.${file2.name.split(".").pop()}`;
  const filepath2 = path.join(uploadDir, filename2);
  const buffer2 = Buffer.from(await file2.arrayBuffer());
  await writeFile(filepath2, buffer2);

  try {
    const newProduct = await Product.create({
      name,
      price,
      talla,
      category,
      productType,
      stock,
      sex,
      image: `/products/${filename1}`,
      imagedos: `/products/${filename2}`,
    });

    return NextResponse.json({ success: true, product: newProduct, msg: "success" });
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json({ success: false, msg: "Error saving product" });
  }
}
