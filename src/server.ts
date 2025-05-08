import express from "express";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
import { connectDB  } from "./config/db";
import router from "./routes/auth.route"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", router);

// app.use(cookieParser());
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
   connectDB();
});