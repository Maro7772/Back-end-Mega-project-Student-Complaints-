import { Document, Types } from "mongoose";
import { Role, Category, Status } from "../ENUM";


interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser extends Document , Timestamps {
  // userID = string ;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;

  resetPassword?: string;
  resetCode?: string;
  resetPasswordExpireAt?: Date;
  verificationToken?: string;
  verificationTokenExpireAt?: Date;
}

export interface IComplaint extends Document , Timestamps {
  // userID = string ;
  student: Types.ObjectId;
  name: string;
  category: Category;
  description: string;
  status: Status;
  submissionDate?: Date;
  resolutionDate?: Date;
}

export interface INotification extends Document {
  // userID = string ;
  user: Types.ObjectId;
  message: string;
  sentAt?: Date;
}
