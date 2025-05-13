import mongoose, { Schema } from "mongoose";
import { IUser } from "../Types/Interfaces";
import { Role } from "../Types/ENUM";

const UserSchema = new Schema<IUser>(
  {
    fullName: String,
    email: { type: String, required:true ,unique: true },
    phoneNumber: String,
    password: { type: String, required:true },
    role: { type: String, enum: Object.values(Role) },
    enrollmentYear: Number,
    department: String,

    resetPassword: String,
    resetCode: String,
    resetPasswordExpireAt:Date,
    verificationToken:String,
    verificationTokenExpireAt:Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
