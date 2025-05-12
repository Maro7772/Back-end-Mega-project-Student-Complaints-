import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { createUserSchema, forgotPasswordSchema, loginUserSchema, resetPasswordSchema } from "../models/auth.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyResetToken } from "../util/generateToken";

// in the env. file the is no space and we put it to make the value secure but here its just for using it in the code 
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";




// ******************[ signup logic ]*****************************

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


// ******************[ login logic ]*****************************

export const login = async (req: Request, res: Response) => {

  try {
    const userlogin = await loginUserSchema.validate(req.body, { abortEarly: false });
    const { email, password } = userlogin;
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


// ******************[ logout logic ]*****************************

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
      res.status(404).json({ message: "User not found" });
      return
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



// ******************[ FrogetPassword logic ]*****************************

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const userforgetpassword = await forgotPasswordSchema.validate(req.body, { abortEarly: false });
    const { email } = userforgetpassword;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({ message: "If this email exists, a reset code has been sent" });
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken(user.id.toString());

    // Save reset token and its expiration time in the user's document
    user.resetPassword = resetToken;
    user.resetPasswordExpireAt = new Date(Date.now() + 3600000);  // Token expires in 1 hour
    await user.save();

    res.status(200).json({
      message: "If this email exists, a reset code has been sent",
      resetToken,
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing forgot password request" });
  }
};



// ******************[ RestPassword logic ]*****************************

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userRestPassword = await resetPasswordSchema.validate(req.body, { abortEarly: false });
    const { email, code, password } = userRestPassword;

    const user = await User.findOne({ email });
    if (!user || user.resetPassword !== code || user.resetPasswordExpireAt?.getTime() < Date.now()) {
      res.status(400).json({ message: "Invalid or expired verification code" });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    // Clear the reset after password is reset
    user.resetPassword = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};
