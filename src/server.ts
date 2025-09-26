import cookieParser from "cookie-parser";
import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import cors from "cors"; // Import CORS middleware
import env from "./util/validateEnv";
import { connectDB } from "./config/db";
import router from "./routes/auth.route";
import ComplaintsRouter from "./routes/complaint.route";
import { errorHandler } from "./middlwares/errorHandler";
import { AppError } from "./util/AppError";

const port = env.PORT;
const app = express();
// this make the frontend read from the server  and the credintails is to add the cookie .
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

app.use("/api/auth", router); // Use the auth routes with API's versioning
app.use("/complaints", ComplaintsRouter); // Use the Complaints routes with API's versioning
// app.use("/api/settings", settingsRouter); // Use the settings routes

app.all("/", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
