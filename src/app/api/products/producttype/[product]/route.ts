import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@/models/ProductType";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  context: { params: { product: string } }
) {
  try {
    // 🔹 Esperar a que Next.js resuelva `params`
    const { params } = await context;

    if (!params?.product) {
      return NextResponse.json(
        { message: "Missing productType ID" },
        { status: 400 }
      );
    }

    const productId = params.product;

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { message: "Invalid productType ID" },
        { status: 400 }
      );
    }

    const productTypeId = new mongoose.Types.ObjectId(productId);

    const productTypeRecord = await ProductType.findById(productTypeId);

    if (!productTypeRecord) {
      return NextResponse.json(
        { message: "Product type not found" },
        { status: 404 }
      );
    }

    const products = await Product.find({ productType: productTypeId });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}
