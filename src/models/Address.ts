import mongoose, { Schema, Document } from "mongoose";

export interface AddressDocument extends Document {
  _id: string;
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const addressSchema = new Schema<AddressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString(); // ✅ Asegurar que el _id sea un string
        return ret;
      },
    },
  }
);

const Address = mongoose.models.Address || mongoose.model<AddressDocument>("Address", addressSchema);

export { Address };
