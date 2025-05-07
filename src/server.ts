import "dotenv/config"; // Load environment variables from .env file
import express, { Request, Response } from "express";
import env from "./util/validateEnv";
import { connectDB  } from "./config/db";
import router from "./routes/auth.route";
import ComplaintsRouter from "./routes/complaint.route";

const port = env.PORT;
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

app.use("/api/auth", router); // Use the auth routes
app.use("/", ComplaintsRouter); // Use the Complaints routes
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
