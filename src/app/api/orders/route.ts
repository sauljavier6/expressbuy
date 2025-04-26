export const dynamic = 'force-dynamic';

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import "@/models/OrderItem";
import "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find()
        .populate({
          path: "items",
          populate: { path: "productId", model: "Product" },
        })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ status: "paid" })
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      orders,
      totalOrders,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
