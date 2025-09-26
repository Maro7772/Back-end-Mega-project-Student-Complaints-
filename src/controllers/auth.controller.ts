import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import {
  createUserValidator,
  loginUserValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  generateAccessToken,
  generateRefreshToken,
  // generateResetToken,
} from "../util/generateToken";
import { catchAsync } from "../util/catchAsync";
import { AppError } from "../util/AppError";
import { REFRESH_SECRET } from "../util/validateEnv";

// ******************[ signup logic ]*****************************
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // try {
    const user = await createUserValidator.validate(req.body, {
      abortEarly: false,
    });
    const { fullName, email, password, role } = user;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new AppError("User already exists. Please log in instead.", 409));
      return;
      // res
      //   .status(409)
      //   .json({ message: "User already exists. Please log in instead." });
      // return;
    }

    const passwordHashed = await bcryptjs.hash(password, 12);
    const newUser = await User.create({
      fullName,
      email,
      password: passwordHashed,
      role,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
    // } catch (error: any) {
    //   if (error.name === "ValidationError") {
    //     res
    //       .status(400)
    //       .json({ message: "Validation failed", errors: error.errors });
    //     return;
    //   }
    //   res.status(500).json({ message: "Error creating user" });
    // }
  }
);

// ******************[ login logic ]*****************************

export const login = catchAsync(async (req: Request, res: Response , next:NextFunction) => {
  // try {
  const userlogin = await loginUserValidator.validate(req.body, {
    abortEarly: false,
  });
  const { email, password } = userlogin;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    next ( new AppError("User not found", 404));
    return ;
    // res.status(404).json({ message: "User not found" });
    // return;
  }

  const isPasswordCorrect = await bcryptjs.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    next(new AppError("Invalid credentials", 401));
    return;
    // res.status(401).json({ message: "Invalid credentials" });
    // return;
  }

  const accessToken = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  // Save refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
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
  // } catch (error: any) {
  //   res.status(500).json({ message: error.message || "Error during login" });
  // }
});

// ******************[ logout logic ]*****************************

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError("Refresh token missing. Please log in again.", 401);
    // res
    //   .status(401)
    //   .json({ message: "Refresh token missing. Please log in again." });
  }

  // try {
  if (!REFRESH_SECRET) {
    throw new AppError("Refresh token missing. Please log in again.", 401);
    // res
    //   .status(401)
    //   .json({ message: "Refresh token missing. Please log in again." });
    // return;
  }
  const decoded = jwt.verify(token, REFRESH_SECRET) as any;

  const existingUser = await User.findById(decoded.id);
  if (!existingUser) {
    throw new AppError("User not found", 404);
    // res.status(404).json({ message: "User not found" });
    // return;
  }

  const newAccessToken = generateAccessToken(existingUser);
  const newRefreshToken = generateRefreshToken(existingUser);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ accessToken: newAccessToken });
  // } catch (err) {
  //   res
  //     .status(401)
  //     .json({ message: "Refresh token expired. Please log in again." });
  // }
});

// ******************[ Forgot Password logic ]*****************************

export const forgotPassword = catchAsync(
  async (req: Request, res: Response , next:NextFunction) => {
    // try {
      const { email } = await forgotPasswordValidator.validate(req.body, {
        abortEarly: false,
      });

      const user = await User.findOne({ email });

      if (!user) {
        // لا تكشف وجود المستخدم لتجنب Timing Attacks
        await new Promise((resolve) => setTimeout(resolve, 500));
        res.status(200).json({
          message: "No user found with this email address . Please try again",
        });
        return;
      }
      if (
        user.resetPasswordExpireAt &&
        user.resetPasswordExpireAt > new Date()
      ) {
        const remainingTime = Math.ceil(
          (user.resetPasswordExpireAt.getTime() - Date.now()) / 60000
        );
        next( new AppError(
          `Please wait ${remainingTime} minutes before requesting a new code`,
          429
        ));
        // res.status(429).json({
        //   message: `Please wait ${remainingTime} minutes before requesting a new code`,
        // });
        // return;
      }
      // // 2. Generate the random reset token
      // const resetToken = generateResetToken(user);

      // منع التكرار قبل انتهاء الصلاحية
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      user.resetCode = verificationCode;
      user.resetPasswordExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

      await user.save({ validateBeforeSave: false });

      // try {
      await sendVerificationEmail(email, verificationCode);
      res.status(200).json({
      message: "If this email exists, a reset code has been sent",
    });

    // } catch (emailError) {
    //   console.error("Failed to send verification email:", emailError);
    // }

    // res.status(200).json({
    //   message: "If this email exists, a reset code has been sent",
    // });
    // } catch (error) {
    //   console.error("Forgot password error:", error);
    //   res
    //     .status(500)
    //     .json({ message: "Error processing forgot password request" });
    // }
  }
);

// ******************[ Send Verification Email logic ]*****************************

const sendVerificationEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // مهم جدًا
    },
  });

  const mailOptions = {
    from: `Your App <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Verification Code",
    html: `<h3>Your verification code is: <b>${code}</b></h3>
           <p>This code will expire in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

// ******************[ Verify Code logic ]*****************************

export const verifyCode = catchAsync(async (req: Request, res: Response , next:NextFunction) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (
    !user ||
    user.resetCode !== code ||
    user.resetPasswordExpireAt! < new Date()
  ) {
    next(new AppError("Invalid or expired code", 400));
    return;
    // res.status(400).json({ message: "Invalid or expired code" });
    // return;
  }

  res.status(200).json({ message: "Code is valid" });
});

// ******************[ Reset Password logic ]*****************************

export const resetPassword = catchAsync(async (req: Request, res: Response , next:NextFunction) => {
  // try {
    const userRestPassword = await resetPasswordValidator.validate(req.body, {
      abortEarly: false,
    });
    const { email, code, password } = userRestPassword;

    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetCode !== code ||
      !user.resetPasswordExpireAt ||
      user.resetPasswordExpireAt.getTime() < Date.now()
    ) {
      next(new AppError("Invalid or expired verification code", 400));
      return;
      // res.status(400).json({ message: "Invalid or expired verification code" });
      // return;
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    user.password = hashedPassword;

    // Clear code and expiry
    user.resetCode = undefined;
    user.resetPasswordExpireAt = undefined;
    user.resetPassword = undefined;

    await user.save();
    const accessToken = generateAccessToken(user._id);
    res
      .status(200)
      .json({ message: "Password reset successfully", accessToken });
  // } catch (error) {
  //   console.error("Reset password error:", error);
  //   res.status(500).json({ message: "Error resetting password" });
  // }
});
