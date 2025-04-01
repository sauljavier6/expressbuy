import { Schema, model, models } from 'mongoose';

const productTypeSchema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export const ProductType = models.ProductType || model('ProductType', productTypeSchema);
