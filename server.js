import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 3001;

//update below to match your own MongoDB connection string.
const MONGO_URL = process.env.MONGO_URL;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("database connection ok");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    console.log("database connection error");
  }

  server.listen(PORT, () => {
    console.log(`listing on port ${PORT}..`);
  });
}
startServer();
