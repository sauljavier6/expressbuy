import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@/models/ProductType";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: Promise<{ product: string }> }) {
  try {
    const { product } = await params;

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
    const products = await Product.find({ productType: product });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}
