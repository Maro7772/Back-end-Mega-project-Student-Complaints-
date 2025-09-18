import { Request } from "express";
import { Document } from "mongoose";
import { Role, Category, Status } from "../ENUM";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
  enrollmentYear?: number;
  department?: string;
  createdAt: Date;
  updatedAt: Date;

  resetPassword?: string;
  resetCode?: string;
  resetPasswordExpireAt: Date;
  verificationToken?: string;
  verificationTokenExpireAt?: Date;
}

export interface IComplaint extends Document {
  studentID: string;
  title: string;
  category: Category;
  description: string;
  status: Status;
  solution: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  userID: string;
  message: string;
  sentAt: Date;
}
