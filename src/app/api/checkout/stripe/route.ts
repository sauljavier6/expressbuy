import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items, total, deliveryAddress, user, storedId } = await req.json();

    const itemsSummary = items.map((item: { _id: string, name: string; price: number; quantity: number, size: string }) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      productId: item._id,
      size: item.size,
    }));

    const itemsMetadata = JSON.stringify(itemsSummary);
    
    if (itemsMetadata.length > 500) {
      console.error("Los metadatos de los productos exceden los 500 caracteres.");
      console.log('error en los datos')
      return NextResponse.json({ error: "Error: Los metadatos son demasiado grandes" }, { status: 400 });
    }

    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: "Total Purchase",
        },
        unit_amount: total * 100,
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
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
