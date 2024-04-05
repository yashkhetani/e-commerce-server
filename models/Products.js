import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  colors: [String],
  company: String,
  reviews: {
    type: Number,
  },
  stars: {
    type: Number,
  },
  category: String,
  shipping: Boolean,
  stock: {
    type: Number,
  },
  description: {
    type: String,
  },
});

const Products = mongoose.model("Products", productSchema);

export default Products;
