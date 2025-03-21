import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";


// 📌 GET: Obtener productos por categoría
export async function GET_BY_CATEGORY(req: Request) {
    await connectDB();
    
    // Obtener el parámetro de categoría desde la URL
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
  
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
  
    const products = await Product.find({ category });
  
    return NextResponse.json(products);
  }