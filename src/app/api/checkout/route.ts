// /app/api/create-order/route.ts
import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import { connectDB } from "@/lib/db";

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { total } = await req.json();

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total.toFixed(2),
              },
            },
          },
        },
      ],
    });

    const response = await client.execute(request);
    const orderId = response.result.id;

    return NextResponse.json({ id: orderId });

  } catch (error) {
    console.error("Error al crear la orden:", error);
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
  }
}
