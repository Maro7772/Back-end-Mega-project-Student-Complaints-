import mongoose, { Schema } from "mongoose";
import { IComplaint } from "../Types/Interfaces";
import { Category, Status } from "../Types/ENUM";

const ComplaintSchema = new Schema<IComplaint>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: String, enum: Object.values(Category) },
    description: String,
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING
    },
    submissionDate: Date,
    resolutionDate: Date
  },
  { timestamps: true }
);

// Models

export const Complaint = mongoose.model<IComplaint>(
  "Complaint",
  ComplaintSchema
);
