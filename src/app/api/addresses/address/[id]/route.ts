import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db"; 
import { Address } from "@/models/Address";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  if (!id || id.trim() === "") {
    return NextResponse.json({ success: false, message: "ID de usuario inválido" }, { status: 400 });
  }
  await connectDB();
  const addresses = await Address.find({ userId: id });
  return NextResponse.json({ success: true, data: addresses });
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  await connectDB();
  const deletedAddress = await Address.findByIdAndDelete(id);
  if (!deletedAddress) {
    return NextResponse.json({ success: false, message: "Dirección no encontrada" });
  }
  return NextResponse.json({ success: true, message: "Dirección eliminada con éxito" });
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  const data = await req.json();
  await connectDB();
  const existingAddress = await Address.findById(id);
  if (!existingAddress) {
    return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
  }
  const updatedAddress = await Address.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json({ message: "Dirección actualizada correctamente", address: updatedAddress }, { status: 201 });
}
