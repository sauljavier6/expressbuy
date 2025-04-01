import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
  try {
    // Convertir el categoryId a ObjectId usando el constructor
    const categoryId = new mongoose.Types.ObjectId(params.category);

    // Verificar si la categoría existe
    const categoryRecord = await Category.findById(categoryId);

    if (!categoryRecord) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    // Si la categoría existe, obtener los productos asociados a esa categoría
    const products = await Product.find({ category: categoryId });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500 }
    );
  }
}
