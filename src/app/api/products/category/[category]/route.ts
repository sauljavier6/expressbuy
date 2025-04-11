import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest,  { params }: { params: { category: string } }) {

  try {  
    await connectDB();
    const { category } = await params;

    if (!category) {
      return NextResponse.json(
        { message: "Missing productType ID" },
        { status: 400 }
      );
    }
    const productCategorypeRecord = await Category.findById(category);

    if (!productCategorypeRecord) {
      return NextResponse.json(
        { message: "Product type not found" },
        { status: 404 }
      );
    }
    const products = await Product.find({ category: category });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error },
      { status: 500 }
    );
  }
}