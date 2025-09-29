import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "./validateEnv";

export const generateAccessToken = (user: any) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (user: any) =>
  jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

export const verifyResetToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
};
