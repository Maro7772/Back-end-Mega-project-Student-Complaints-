import type {
  ErrorRequestHandler,
} from "express";
import { AppError } from "../util/AppError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // console.error("Error occurred:", err);

  // لو error معمول بـ AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // أي error تاني (bugs, unexpected errors)
  res.status(500).json({
    status: "error2",
    message: "Something went wrong",
  });
};
