import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest,  { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  console.log('entro a la api', category)
  try {
    return NextResponse.json({name:"producto prueba"});
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500 }
    );
  }
}
