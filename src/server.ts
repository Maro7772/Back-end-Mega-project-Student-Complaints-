<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
=======
import "dotenv/config"; // Load environment variables from .env file
import express, { Request, Response } from "express";
import env from "./util/validateEnv";
>>>>>>> 0f56d3f9fd3c100be18820f24a4c0564a88d9d1d
import { connectDB  } from "./config/db";
import router from "./routes/auth.route";
import ComplaintsRouter from "./routes/complaint.route";

const port = env.PORT;
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

<<<<<<< HEAD
app.use("/api/auth", router);

// app.use(cookieParser());
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
   connectDB();
});
=======
app.use("/api/auth", router); // Use the auth routes
app.use("/", ComplaintsRouter); // Use the Complaints routes
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
>>>>>>> 0f56d3f9fd3c100be18820f24a4c0564a88d9d1d
