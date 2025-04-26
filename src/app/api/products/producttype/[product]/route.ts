import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@/models/ProductType";
import Product from "@/models/Product";

export async function GET(request: NextRequest, { params }: { params: { product: string } }) {
  try {
    const { product } = params;

    if (!product) {
      return NextResponse.json(
        { message: "Missing productType ID" },
        { status: 400 }
      );
    }

    const productTypeRecord = await ProductType.findById(product);
    if (!productTypeRecord) {
      return NextResponse.json(
        { message: "Product type not found" },
        { status: 404 }
      );
    }

    // Obtener parámetros de paginación desde la URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    // Total de productos
    const totalProducts = await Product.countDocuments({ productType: product });

    // Productos paginados
    const products = await Product.find({ productType: product })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({ products, totalPages });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}
