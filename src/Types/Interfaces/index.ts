
import mongoose, { Document } from 'mongoose';
import { Role, Category, Status } from '../ENUM';

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
  // userID = string ;

  
  resetPassword?: String,
   resetCode?: String,
  resetPasswordExpireAt:Date,
  verificationToken?:String,
  verificationTokenExpireAt?:Date,
}

export interface IComplaint extends Document {
  // userID = string ;
  student: mongoose.Types.ObjectId;
  name: string;
  category: Category;
  description: string;
  status: Status;
  submissionDate: Date;
  resolutionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface INotification extends Document {
  // userID = string ;
  user: mongoose.Types.ObjectId;
  message: string;
  sentAt: Date;
}
