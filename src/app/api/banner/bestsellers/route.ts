import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderItem from "@/models/OrderItem";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Consulta para obtener los productos más vendidos
    const bestSellingProducts = await OrderItem.aggregate([
      {
        $group: {
          _id: "$productId", // Agrupar por productId
          totalQuantity: { $sum: "$quantity" }, // Sumar la cantidad vendida
        },
      },
      { $sort: { totalQuantity: -1 } }, // Ordenar de mayor a menor
      { $limit: 4 }, // Obtener solo los 6 más vendidos
      {
        $lookup: {
          from: "products", // Relación con la colección de productos
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" }, // Descomprimir el producto
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          image: "$product.image",
          price: "$product.price",
          category: "$product.category",
          gender: "$product.gender",
          sizes: "$product.sizes",
          totalQuantity: 1,
        },
      },
    ]);

    return NextResponse.json({ bestSellingProducts }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}