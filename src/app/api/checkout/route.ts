import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import Order from "@/models/Order";
import Address from "@/models/Address"; 
import Product from "@/models/Product";
import paypal from "@paypal/checkout-server-sdk";
import Stripe from "stripe";
import { describe } from "node:test";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)   
const client = new paypal.core.PayPalHttpClient(environment)

export async function POST() {
  const request = new paypal.orders.OrdersCreateRequest()
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ 
      amount: { 
        currency_code: "USD", 
        value: 1.00, // amount.toFixed(2) 
        breakdown: {
          item_total: {
            currency_code: "USD", 
            value: 1.00, // amount.toFixed(2) 
          }
        }
    },
    items: [
      {
        name: "prueba",
        description: "prueba de pago",
        quantity: "1",
        unit_amount: {
          currency_code: "USD", 
          value: 1.00, // amount.toFixed(2) 
        }
      }
    ]
  }],
  })

  const response = await client.execute(request);
  console.log(response)

  return NextResponse.json({ id: response.result.id})
}

/*
export async function POST(req: any) {
  await connectDB();
  const { userId, cart, paymentMethod, address } = await req.json();

  if (!cart || cart.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
  }

  try {
    // 1️⃣ Guardar dirección en la base de datos
    const savedAddress = await Address.create({ userId, ...address });

    // 2️⃣ Crear la orden con la dirección incluida
    const order = await Order.create({
      userId,
      items: cart,
      total: cart.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0),
      status: "pending",
      address: savedAddress, // Guardamos la dirección en la orden
      paymentMethod,
    });

    // 3️⃣ Procesar pago
    let paymentResponse;

    if (paymentMethod === "paypal") {
      paymentResponse = await processPayPalPayment(order.total);
    } else if (["visa", "mastercard", "amex"].includes(paymentMethod)) {
      paymentResponse = await processStripePayment(order.total);
    } else {
      return NextResponse.json({ error: "Método de pago no soportado" }, { status: 400 });
    }

    if (!paymentResponse.success) {
      return NextResponse.json({ error: "Error en el pago" }, { status: 500 });
    }

    // 4️⃣ Actualizar orden y stock
    order.status = "paid";
    order.paymentId = paymentResponse.transactionId;
    await order.save();

    for (const item of cart) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
    }

    return NextResponse.json({ message: "Pago exitoso", orderId: order._id });
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Función para procesar pago con PayPal
async function processPayPalPayment(amount:any) {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: amount.toFixed(2) } }],
    });

    const response = await paypalClient().execute(request);
    return { success: true, transactionId: response.result.id };
  } catch (error) {
    console.error("Error en PayPal:", error);
    return { success: false };
  }
}

// 🔹 Función para procesar pago con Stripe (Visa, Mastercard, Amex)
async function processStripePayment(amount:any) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    return { success: true, transactionId: paymentIntent.id };
  } catch (error) {
    console.error("Error en Stripe:", error);
    return { success: false };
  }
}
*/