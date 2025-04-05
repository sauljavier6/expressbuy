import { Schema, model, models, Document } from "mongoose";

interface OrderDocument extends Document {
  total: number;
  paymentId: string;
  name: string;
  email: string;
  userId?: string;
  status: string;
  address: string;
  items: string[]; // También convertimos ObjectId a string
  createdAt: Date; // Agregado para asegurar ordenación
}

const orderSchema = new Schema<OrderDocument>(
  {
    total: { type: Number, required: true },
    paymentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    status: { type: String, default: "pending" },
    address: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }], // Relación con OrderItem
  },
  {
    timestamps: true, // ✅ Agrega createdAt y updatedAt automáticamente
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString(); // ✅ Convertimos _id a string
        if (ret.userId) ret.userId = ret.userId.toString(); // ✅ Convertimos userId si existe
        //ret.items = ret.items.map((item: any) => item.toString()); // ✅ Convertimos items a string[]
        return ret;
      },
    },
  }
);

const Order = models.Order || model<OrderDocument>("Order", orderSchema);

export default Order;
