import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category"; // Asegúrate de tener este modelo
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();
    
    try {
      const newCategory = await Category.create(data);
      return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Error creating category" }, { status: 500 });
    }
  }

