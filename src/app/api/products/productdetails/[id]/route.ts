import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return new NextResponse(JSON.stringify({ message: 'Producto no encontrado' }), {
        status: 404,
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching product" }),
      { status: 500 }
    );
  }
}
