import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import Order from "@/models/Order";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: any) {
    try {
      const { orderId } = await params;
      const { status } = await req.json(); // Obtener el nuevo estado desde el body de la solicitud
  
      // Validar que el estado sea válido
      if (!["paid", "shipped", "delivered", "cancelled"].includes(status)) {
        return new NextResponse(
          JSON.stringify({ error: "Estado inválido" }),
          { status: 400 }
        );
      }
  
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
  
      if (!order) {
        return new NextResponse(
          JSON.stringify({ error: "Orden no encontrada" }),
          { status: 404 }
        );
      }
  
      return new NextResponse(JSON.stringify(order), { status: 200 });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return new NextResponse(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500 }
      );
    }
  }
  
  export async function GET(req: NextRequest, { params }: any) {
    try {
      // Conectarse a la base de datos
      await connectDB();
  
      // Obtener el parámetro orderId de la URL (por ejemplo, /api/orders/order/[orderId])
      const { orderId } = await params;

      // Verificar que orderId es un ObjectId válido
      if (!orderId) {
        return new NextResponse(
          JSON.stringify({ message: 'ID de orden inválido.' }),
          { status: 400 }
        );
      }
  
      // Buscar la orden por ID
      const order = await Order.findById(orderId)
      .populate({
        path: "items",
        populate: { path: "productId", model: "Product" },
      })
  
      if (!order) {
        return new NextResponse(
          JSON.stringify({ message: 'Orden no encontrada.' }),
          { status: 404 }
        );
      }
  
      // Si la orden se encuentra, devolvemos la respuesta con los datos
      return new NextResponse(
        JSON.stringify({ order, message: 'success' }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error al buscar la orden:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Hubo un error en el servidor.' }),
        { status: 500 }
      );
    }
  }
  