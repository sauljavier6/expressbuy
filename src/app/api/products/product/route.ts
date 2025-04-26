import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";

// 📌 GET: Obtener productos
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments()
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    products,
    total,
    totalPages,
    currentPage: page
  });
}

// 📌 POST: Agregar producto
export async function POST(req: Request) {
  const data = await req.formData();
  const file1 = data.get("image") as File;
  const file2 = data.get("imageTwo") as File;

  const name = data.get("name");
  const price = parseFloat(data.get("price") as string);
  const category = data.get("category");
  const productType = data.get("productType");
  const gender = data.get("gender");

  const sizesRaw = data.get("sizes") as string;

  if (!name || !price || !category || !productType || !gender || !sizesRaw) {
    return NextResponse.json({ success: false, msg: "Necessary data is missing" });
  }

  let sizes;
  try {
    sizes = JSON.parse(sizesRaw);
    if (!Array.isArray(sizes)) throw new Error("Sizes is not an array");
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Invalid size format" });
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
      category,
      productType,
      gender,
      sizes,
      image: upload1.secure_url,
      imagedos: upload2.secure_url,
    });

    return NextResponse.json({ success: true, product: newProduct, msg: "success" });
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json({ success: false, msg: "Error saving product" });
  }
}
