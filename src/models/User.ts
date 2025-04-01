// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentMethod {
  cardType: string;
  last4: string;
}

interface Order {
  orderId: string;
  date: Date;
  total: number;
  status: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  password?: string;
  googleId?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  orders?: Order[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    password: { type: String }, // No obligatorio si usa Google
    googleId: { type: String, unique: true }, // Nuevo campo para autenticación con Google
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    ],
    paymentMethods: [
      {
        cardType: String,
        last4: String,
      },
    ],
    orders: [
      {
        orderId: String,
        date: Date,
        total: Number,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export { User };
