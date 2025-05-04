import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());

app.listen(5000, () => {
  connectDB();
  console.log("Server is running on http://localhost:5000");
});
