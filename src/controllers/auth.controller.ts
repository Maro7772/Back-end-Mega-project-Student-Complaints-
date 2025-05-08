import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { object, string } from "yup";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const createUserSchema = object({
  fullName: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: string().oneOf(["student", "admin"], "Role must be either 'student' or 'admin'").required("Role is required"),
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

const generateAccessToken = (user: any) => {
   jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "5m" });
  return
};

const generateRefreshToken = (user: any) => {
   jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET, { expiresIn: "7d" });
   return
};

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await createUserSchema.validate(req.body, { abortEarly: false });
    const { fullName, email, password, role } = user;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(409).json({ message: "User already exists. Please log in instead." });
       return 
    }

    const passwordHashed = await bcryptjs.hash(password, 12);
    const newUser = await User.create({ fullName, email, password: passwordHashed, role });

    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
       res.status(400).json({ message: "Validation failed", errors: error.errors });
       return
    }
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
       res.status(404).json({ message: "User not found" });
      return
    }

    const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
       res.status(401).json({ message: "Invalid credentials" });
      return
    }

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    // Save refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error during login" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
     res.status(401).json({ message: "Refresh token missing. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as any;

    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(existingUser);
    const newRefreshToken = generateRefreshToken(existingUser);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Refresh token expired. Please log in again." });
  }
};
