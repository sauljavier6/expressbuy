import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true }, // Relación con Order
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Relación con Product
  name: String,
  price: Number,
  quantity: Number,
  talla: String,
});

const OrderItem = models.OrderItem || model("OrderItem", orderItemSchema);

export default OrderItem;
