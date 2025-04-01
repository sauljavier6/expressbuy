import { Schema, model, models } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    paymentId: String,
    status: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);

export default Order;
