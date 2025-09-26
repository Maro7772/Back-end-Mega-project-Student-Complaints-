import mongoose, { Schema } from "mongoose";
import { IComplaint } from "../Types/Interfaces";
import { Category, Status } from "../Types/ENUM";

const ComplaintSchema = new Schema<IComplaint>(
  {
    studentID: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, enum: Object.values(Category), required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    solution: String,
  },
  { timestamps: true }
);

// Models
const Complaint = mongoose.model<IComplaint>("Complaint", ComplaintSchema);

export default Complaint;
