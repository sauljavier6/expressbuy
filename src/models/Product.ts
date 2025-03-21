import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);
