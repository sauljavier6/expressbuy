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

//Funcion de email
async function sendConfirmationEmail(userEmail: string, userName: string, orderId: string, total: number, formattedAddress: string, items:any) {
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
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <h1 style="text-align: center; color: #4CAF50;">Thank you for your purchase, ${userName}!</h1>
      
        <p style="font-size: 16px; color: #555;">Your order <strong>${orderId}</strong> has been successfully processed.</p>
        <p style="font-size: 16px; color: #555;">Here are the details of your purchase:</p>
  
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #4CAF50; color: white;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: { name: any; price: number; quantity: number; }) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">${item.name}</td>
                <td style="padding: 10px;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px;">${item.quantity}</td>
                <td style="padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
  
        <p style="font-size: 16px; color: #555;"><strong>Subtotal:</strong> $${(total - 6).toFixed(2)} USD</p>
        <p style="font-size: 16px; color: #555;"><strong>Shipping Cost:</strong> $6.00 USD</p>
        <p style="font-size: 18px; color: #000;"><strong>Total:</strong> $${total.toFixed(2)} USD</p>

        <p style="font-size: 16px; color: #555;"><strong>Delivery Address:</strong></p>
        <p style="font-size: 16px; color: #555;">${formattedAddress}</p>
        
        <p style="font-size: 16px; color: #555;">We will notify you when your order is on its way.</p>
  
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #888;">If you have any questions, feel free to contact us.</p>
          <p style="font-size: 14px; color: #888;">Thank you for choosing us!</p>
        </div>
      </div>
    </div>
    `,
  };  

  await transporter.sendMail(mailOptions);
}
