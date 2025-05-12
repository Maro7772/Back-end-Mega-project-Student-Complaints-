import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

export const generateAccessToken = (user: any) =>
    jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "20m" });


export const generateRefreshToken = (user: any) =>
    jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET, { expiresIn: "7d" });


export const generateResetToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" }); // Short-lived token
};

 export const verifyResetToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: string };
};

