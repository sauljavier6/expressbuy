import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";

// 📌 PUT: Actualizar producto
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const data = await req.formData();
    const file = data.get("image") as File | null;
    const file2 = data.get("imagedos") as File | null;

    const name = data.get("name");
    const price = data.get("price") ? parseFloat(data.get("price") as string) : undefined;
    const category = data.get("category");
    const productType = data.get("productType");
    const gender = data.get("gender");

    const sizesRaw = data.get("sizes") as string;
    let newSizes: { size: string; stock: number }[] = [];

    try {
      newSizes = JSON.parse(sizesRaw);
      if (!Array.isArray(newSizes)) throw new Error("Sizes must be an array");
    } catch (err) {
      return NextResponse.json({ success: false, msg: "Formato de talla inválido" }, { status: 400 });
    }

    const updateFields: any = { name, price, category, productType, gender };

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

    // 📌 Obtener el producto actual
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ success: false, msg: "Producto no encontrado" }, { status: 404 });
    }

    const existingSizes = existingProduct.sizes || [];

    newSizes.forEach((newItem) => {
      const index = existingSizes.findIndex((item: any) => item.size === newItem.size);
    
      if (index > -1) {
        // La talla ya existe, actualiza el stock
        existingSizes[index].stock = newItem.stock;
      } else {
        // La talla no existe, agrégala
        existingSizes.push(newItem);
      }
    });
    
    // Luego, eliminar las tallas que ya no están
    const sizesToDelete = existingSizes.filter(
      (item: any) => !newSizes.some((newItem) => newItem.size === item.size)
    );
    
    sizesToDelete.forEach((itemToDelete: any) => {
      const indexToRemove = existingSizes.findIndex((size: any) => size.size === itemToDelete.size);
      if (indexToRemove > -1) {
        existingSizes.splice(indexToRemove, 1);
      }
    });    

    updateFields.sizes = existingSizes;

    // 📌 Eliminar campos undefined
    Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    return NextResponse.json({ success: true, product: updatedProduct, msg: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json({ success: false, msg: "Error al actualizar el producto" }, { status: 500 });
  }
}
