import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { IUser } from "../Types/Interfaces/";
import { object, string } from "yup"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

const createUserSchema = object({
  fullName: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: string().oneOf(["student", "admin"], "Role must be either 'student' or 'admin'").required("Role is required"),
})

export const signup = async (req: Request, res: Response) => {



  try {
    const user = await createUserSchema.validate(req.body, { abortEarly: false });

    const { fullName, email, password, role } = user;

    const existingUser = await User.findOne({ email, password });
    if (existingUser) {
      res.status(409).json({
        message: "User already exists. Please log in instead.",
      });
      return
    }

    const passwordHashed = await bcryptjs.hash(user.password, 12);


    const newUser = await User.create({
      fullName,
      email,
      password: passwordHashed,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id
    });

  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message || "Error creating user", errors: error.errors });
  }
}



const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const login = async (req: Request, res: Response) => {
  const { email, password }: IUser = req.body;

  try {

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



    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error during login" });
  }

}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });

}
