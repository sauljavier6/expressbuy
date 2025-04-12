import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await params;
    console.log('category desde la api',category)

    /*if (!category) {
      return NextResponse.json(
        { message: "Missing productType ID" },
        { status: 400 }
      );
    }
    const productTypeRecord = await Category.findById(category);

    if (!productTypeRecord) {
      return NextResponse.json(
        { message: "Product type not found" },
        { status: 404 }
      );
    }*/
    const products = await Product.find({ category: "67e302992f121b2eb4f7ff26" });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}
