import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@/models/ProductType";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(request: NextRequest, context: { params: { product: string } }) {
  try {
    const productId = (await(await context).params).product;

    if (!productId) {
      return NextResponse.json(
        { message: "Missing productType ID" },
        { status: 400 }
      );
    }

    const productTypeRecord = await ProductType.findById(productId);

    if (!productTypeRecord) {
      return NextResponse.json(
        { message: "Product type not found" },
        { status: 404 }
      );
    }

    const products = await Product.find({ productType: productId });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}
