
import { connectDB } from "@/lib/db"; 
import Order from "@/models/Order";
import "@/models/OrderItem";
import "@/models/Product";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Obtener los parámetros de la URL
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Obtener la página actual desde los parámetros de búsqueda
    const page = parseInt(searchParams.get("page") || "1", 10);
    const ordersPerPage = 10; // Número de órdenes por página
    
    // Obtener el total de órdenes con status "paid"
    const totalOrders = await Order.countDocuments({ status: "paid" });
    
    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    
    // Obtener las órdenes paginadas, ordenadas por la fecha de creación
    const orders = await Order.find()//({ status: "paid" })
      .populate({
        path: "items",
        populate: { path: "productId", model: "Product" },
      })
      .sort({ createdAt: 1 }) // Ordenar de la más vieja a la más nueva
      .skip((page - 1) * ordersPerPage) // Paginación: omitir los primeros registros
      .limit(ordersPerPage)
      .lean();

    return new Response(JSON.stringify({ orders, totalOrders, totalPages }), { status: 200 });
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}


