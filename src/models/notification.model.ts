import mongoose, { Schema } from "mongoose";
import { INotification } from "../Types/Interfaces";

const NotificationSchema = new Schema<INotification>({
  userID: { type: String, ref: "User" },
  message: String,
  sentAt: Date,
});

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
