import express from "express";
import {
  getProducts,
  singleProduct,
  getcartProducts,
  removeFromcart,
  addToCart,
  clearCart,
} from "../controller/products.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", singleProduct);
router.post("/products/:id", addToCart);
router.post("/cart", getcartProducts);
router.post("/removeproduct", removeFromcart);
router.post("/clearcart", clearCart);

export default router;
