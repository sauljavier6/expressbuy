import mongoose, { Schema, model, models } from "mongoose";

// Definir el esquema de categorías
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }, // Opcional
}, { timestamps: true });

// Crear el modelo de categoría
export const Category = models.Category || model("Category", categorySchema);
