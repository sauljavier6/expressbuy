import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  password?: string;
  googleId?: string;
  role: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    password: { type: String },
    googleId: { type: String, unique: true },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user",
      required: true 
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export { User };
