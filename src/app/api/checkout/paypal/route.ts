// /app/api/capture-order/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import paypal from "@paypal/checkout-server-sdk";
import Order from "@/models/Order";
import OrderItem from "@/models/OrderItem";
import Product from "@/models/Product";
import { Address } from "@/models/Address";
import nodemailer from "nodemailer";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { orderId, items, total, deliveryAddress, user, storedId } = await req.json();

    // 1️⃣ Capturar el pago
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const captureResponse = await client.execute(request);

    if (captureResponse.result.status !== "COMPLETED") {
      return NextResponse.json({ error: "El pago no fue completado." }, { status: 400 });
    }

    const formattedAddress = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.zip}, ${deliveryAddress.country}`;

    // 2️⃣ Guardar la orden en MongoDB
    const order = await Order.create({
      name: user.name,
      email: user.email,
      total,
      paymentId: orderId,
      userId: storedId ?? null,
      status: "paid",
      address: formattedAddress,
    });

    // 3️⃣ Guardar productos
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        return await OrderItem.create({
          orderId: order._id,
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          talla: item.talla || "",
        });
      })
    );

    order.items = orderItems.map(item => item._id);
    await order.save();

    // 4️⃣ Guardar dirección si no existe
    if (storedId && storedId !== "") {
      const exists = await Address.findOne({
        userId: storedId,
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        zip: deliveryAddress.zip,
        country: deliveryAddress.country,
      });

      if (!exists) {
        await Address.create({ userId: storedId, ...deliveryAddress });
      }
    }

    // 5️⃣ Actualizar stock
    await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item._id);
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          throw new Error(`Stock insuficiente para el producto ${product?.name}`);
        }
      })
    );

    // 6️⃣ Enviar email
    await sendConfirmationEmail(user.email, user.name, order._id.toString(), total, formattedAddress, items);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error al capturar la orden:", error);
    return NextResponse.json({ error: "Error al capturar la orden" }, { status: 500 });
  }
}


async function sendConfirmationEmail(userEmail: string, userName: string, orderId: string, total: number, formattedAddress: string, items: any[]) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Online Store" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: "Purchase Confirmation",
    html: `
      <h2>Thank you for your purchase, ${userName}!</h2>
      <p>Your order ID is <strong>${orderId}</strong></p>
      <table>
        <thead>
          <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <p><strong>Total:</strong> $${total.toFixed(2)} USD</p>
      <p><strong>Shipping to:</strong> ${formattedAddress}</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
