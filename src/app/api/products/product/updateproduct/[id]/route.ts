import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";

// 📌 PUT: Actualizar producto
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const data = await req.formData();
    const file = data.get("image") as File | null;
    const file2 = data.get("imagedos") as File | null;

    const name = data.get("name");
    const price = data.get("price") ? parseFloat(data.get("price") as string) : undefined;
    const size = data.get("size");
    const category = data.get("category");
    const productType = data.get("productType");
    const stock = data.get("stock") ? parseInt(data.get("stock") as string, 10) : undefined;
    const gender = data.get("gender");

    const updateFields: any = { name, price, size, category, productType, stock, gender };

    // 📌 Subir imagen a Cloudinary si hay una nueva
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

      const upload = await cloudinary.uploader.upload(base64Image, {
        folder: "products",
        public_id: uuidv4(),
      });

      updateFields.image = upload.secure_url;
    }

    if (file2 && file2.size > 0) {
      const buffer2 = Buffer.from(await file2.arrayBuffer());
      const base64Image2 = `data:${file2.type};base64,${buffer2.toString("base64")}`;

      const upload2 = await cloudinary.uploader.upload(base64Image2, {
        folder: "products",
        public_id: uuidv4(),
      });

      updateFields.imagedos = upload2.secure_url;
    }

    // 📌 Filtrar campos undefined
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
