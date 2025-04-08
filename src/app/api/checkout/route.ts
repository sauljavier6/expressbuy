import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import Order from "@/models/Order";
import {Address} from "@/models/Address"; 
import paypal from "@paypal/checkout-server-sdk";
import OrderItem from "@/models/OrderItem";
import nodemailer from "nodemailer";
import Product from "@/models/Product"; 

const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  try {
    await connectDB();

    const { items, total, deliveryAddress, user, storedId } = await req.json();

    // 1️⃣ Crear la orden en PayPal
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
              }
            }
          }
        }
      ],
    });

    const response = await client.execute(request);
    const paymentId = response.result.id;

    // ✅ Validación: si no se creó correctamente la orden
    if (!paymentId || response.statusCode !== 201) {
      return NextResponse.json({ error: "No se pudo crear la orden en PayPal." }, { status: 400 });
    }

    const formattedAddress = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.zip}, ${deliveryAddress.country}`;

    // 2️⃣ Guardar la orden en MongoDB
    const order = await Order.create({
      name: user.name,
      email: user.email,
      total: total,
      paymentId: paymentId,
      userId: storedId ?? null,
      status: "paid",
      address: formattedAddress,
    });

    // 3️⃣ Guardar productos
    const orderItems = await Promise.all(
      items.map(async (item: { _id: any; name: any; price: any; quantity: any; talla: any; }) => {
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
    if (storedId && (storedId !== "" || storedId !== null)) {
      const existingAddress = await Address.findOne({
        userId: storedId,
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        zip: deliveryAddress.zip,
        country: deliveryAddress.country
      });

      if (!existingAddress) {
        await Address.create({
          userId: storedId,
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zip: deliveryAddress.zip,
          country: deliveryAddress.country
        });
      }
    }

    // 5️⃣ Restar stock
    await Promise.all(
      items.map(async (item: { _id: any; quantity: number; }) => {
        const product = await Product.findById(item._id);
        if (product) {
          if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
          } else {
            throw new Error(`No hay suficiente stock para el producto ${product.name}`);
          }
        }
      })
    );

    // 6️⃣ Enviar correo
    await sendConfirmationEmail(user.email, user.name, order._id.toString(), total, formattedAddress, items);

    return NextResponse.json({ id: paymentId });

  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}


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
  
        <p style="font-size: 16px; color: #555;"><strong>Total:</strong> $${total.toFixed(2)} USD</p>
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