import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey = "your-secretkey-here";

const register = async (req, resp) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return resp.status(404).json({ msg: "Please provide all values" });
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    return resp.status(404).json({ msg: "user already exists" });
  }

  // Encrypt password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newuser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ name }, secretKey);
  resp.status(StatusCodes.CREATED).json({
    user: { name: newuser.name, email: newuser.email, token: token },
  });
};

const login = async (req, resp) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return resp.status(404).json({ msg: "Please provide all values" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return resp.status(404).json({ msg: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return resp.status(401).json({ msg: "Incorrect password" });
  }
  const token = jwt.sign({ sub: user.id }, "secret_key", {
    expiresIn: "1h",
  });

  let productcsInTheCart = user.cart.length;

  resp.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      token: token,
      products: productcsInTheCart,
    },
  });
};

export { register, login };
