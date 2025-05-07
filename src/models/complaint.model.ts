import mongoose, { Schema } from "mongoose";
import { IComplaint } from "../Types/Interfaces";
import { Category, Status } from "../Types/ENUM";

const ComplaintSchema = new Schema<IComplaint>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    category: { type: String, enum: Object.values(Category), required: true },
    description: { type: String, required: true },
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
const Complaint = mongoose.model<IComplaint>(
  "Complaint",
  ComplaintSchema
);

export default Complaint; 
