import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, context : Promise<{ params: { id: string } }>) {
  try {
    const id = (await(await context).params).id;

    const product = await Product.findById(id); // aquí va el id directamente

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
