import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Falta la variable MONGODB_URI en .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return; // Ya está conectado
    }
    await mongoose.connect(MONGODB_URI, {
      dbName: "expressbuy", // Nombre de la base de datos
    });
    console.log("🔥 Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB", error);
  }
};
