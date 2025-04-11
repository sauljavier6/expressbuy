import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await connectDB();
    const { category } = params;

    const categoryRecord = await Category.findById(category);

    if (!categoryRecord) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    const products = await Product.find({ category: category });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500 }
    );
  }
}
