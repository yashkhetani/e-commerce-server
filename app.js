import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroute.js";
import productsRoutes from "./routes/productsroute.js";
dotenv.config();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/", authRoutes);
app.use("/", productsRoutes);

app.get("*", (req, resp) => {
  resp.status(404).json({ msg: "not found" });
});

export default app;
