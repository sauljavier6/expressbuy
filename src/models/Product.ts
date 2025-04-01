import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  talla: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  productType: { type: Schema.Types.ObjectId, ref: 'ProductType', required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  sex: { type: String, required: true },
}, { timestamps: true });

productSchema.index({ category: 1 });

// Verifica si el modelo ya está definido
const Product = models.Product || model('Product', productSchema);

export default Product;