import { NextResponse } from "next/server";
import Stripe from 'stripe';

// configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items, total, deliveryAddress, user, storedId } = await req.json();

    // Solo mantener información esencial
    const itemsSummary = items.map((item: { _id: string, name: string; price: number; quantity: number, talla: string }) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      productId: item._id,
      talla: item.talla,

    }));

    // Convertir los items resumidos a JSON y verificar su longitud
    const itemsMetadata = JSON.stringify(itemsSummary);
    
    if (itemsMetadata.length > 500) {
      console.error("Los metadatos de los productos exceden los 500 caracteres.");
      return NextResponse.json({ error: "Error: Los metadatos son demasiado grandes" }, { status: 400 });
    }

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item: { name: any; price: number; quantity: any; }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        userId: storedId,
        email: user.email,
        userName: user.name,
        total: total.toString(),
        deliveryAddress: JSON.stringify(deliveryAddress),
        items: itemsMetadata,
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Error creating stripe order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
