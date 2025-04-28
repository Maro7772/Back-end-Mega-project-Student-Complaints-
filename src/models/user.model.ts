import mongoose, { Schema } from "mongoose";
import { IUser } from "../Types/Interfaces";
import { Role } from "../Types/ENUM";

const UserSchema = new Schema<IUser>(
  {
    fullName: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    passwordHash: String,
    role: { type: String, enum: Object.values(Role) },
    enrollmentYear: Number,
    department: String
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
