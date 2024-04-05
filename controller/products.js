import Products from "../models/Products.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

const getProducts = async (req, resp) => {
  let { sort, search, category, company, price } = req.query;
  const queryObject = {};

  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }
  if (category === "All") {
    category = null;
  }
  if (category && category !== "All") {
    queryObject.category = { $regex: category, $options: "i" };
  }
  if (company === "All") {
    company = null;
  }
  if (company && company !== "All") {
    queryObject.company = { $regex: company, $options: "i" };
  }
  if (price && price !== "0") {
    queryObject.price = { $lt: price };
  }
  let result = Products.find(queryObject);

  if (sort === "low-high") {
    result = result.sort({ price: 1 });
  }
  if (sort === "hign-low") {
    result = result.sort({ price: -1 });
  }
  if (sort === "A-z") {
    result = result.sort({ name: 1 });
  }
  if (sort === "Z-a") {
    result = result.sort({ name: -1 });
  }

  const products = await result;
  resp.status(200).json(products);
};

const singleProduct = async (req, resp) => {
  const { id } = req.params;
  const product = await Products.find({ id: id });
  if (product.length === 0) {
    return resp.status(404).json({ msg: "product not found" });
  }
  resp.status(200).json(product[0]);
};

const addToCart = async (req, resp) => {
  const { name, id } = req.body;
  const currentUser = await User.findOne({ name: name });
  const product = await Products.findOne({ id: id });
  currentUser.cart.push(product);
  await currentUser.save();
  resp.status(StatusCodes.CREATED).json({ msg: "success" });
};

const getcartProducts = async (req, resp) => {
  const { name } = req.body;
  const currentUser = await User.findOne({ name: name }).populate("cart");
  resp.status(201).json({ cart: currentUser.cart });
};

const removeFromcart = async (req, resp) => {
  const { name, id } = req.body;
  const product = await Products.find({ id: id });

  await User.findOneAndUpdate(
    { name: name },
    { $pull: { cart: product[0]._id } }
  );
  resp.status(StatusCodes.CREATED).json({ msg: "success" });
};

const clearCart = async (req, resp) => {
  const { name } = req.body;
  await User.findOneAndUpdate({ name: name }, { cart: [] });
  resp.status(StatusCodes.OK).json({ msg: "cart cleared" });
};

export {
  getProducts,
  singleProduct,
  addToCart,
  getcartProducts,
  removeFromcart,
  clearCart,
};
