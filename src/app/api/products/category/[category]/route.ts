import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const { category } = params;

  console.log("✅ Entró al endpoint con categoría:", category);

  // Lista de prueba (mock)
  const mockProducts = [
    {
      _id: "1",
      name: "Producto 1",
      price: 100,
      image: "https://via.placeholder.com/150",
      stock: 10,
    },
    {
      _id: "2",
      name: "Producto 2",
      price: 200,
      image: "https://via.placeholder.com/150",
      stock: 5,
    },
    {
      _id: "3",
      name: "Producto 3",
      price: 300,
      image: "https://via.placeholder.com/150",
      stock: 20,
    },
  ];

  return NextResponse.json(mockProducts);
}
