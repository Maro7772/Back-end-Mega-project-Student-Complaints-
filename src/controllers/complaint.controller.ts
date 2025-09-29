import type { Request, Response, NextFunction } from "express";
import Complaint from "../models/complaint.model";
import * as Yup from "yup";

// ================== Schemas ==================
const createComplaintSchema = Yup.object({
  title: Yup.string().required("Complaint Name is required"),
  category: Yup.string()
    .required("Category is required")
    .oneOf(["Academic", "Non-Academic"], "Invalid category"),
  description: Yup.string().required("Description is required"),
});

// ================== Helpers ==================
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  res.status(status).json({ success, message, data });
};

// ================== Controllers ==================

// Create Complaint
export const createComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const complaintBody = await createComplaintSchema.validate(req.body, {
      abortEarly: false,
    });

    const complaint = await Complaint.create({
      studentID: req.user._id,
      ...complaintBody,
      solution: "",
      status: "Pending",
    });

    sendResponse(res, 201, true, "Complaint created successfully", complaint);
  }
);

// Get All Complaints
export const getComplaints = asyncHandler(
  async (_req: Request, res: Response) => {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    sendResponse(res, 200, true, "Complaints fetched", complaints);
  }
);

// Get My Complaints
export const myComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const complaints = await Complaint.find({ studentID: req.user._id }).sort({
      createdAt: -1,
    });
    sendResponse(res, 200, true, "My complaints fetched", complaints);
  }
);

// Delete Complaint
export const deleteComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) {
      return sendResponse(res, 404, false, "Complaint not found");
    }
    sendResponse(res, 200, true, "Complaint deleted successfully");
  }
);

// Update Complaint
export const updateComplaint = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, description, title, solution, status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return sendResponse(res, 404, false, "Complaint not found");
    }

    const updateData: any = {};

    if (req.user?.role === "student") {
      if (complaint.studentID.toString() !== req.user._id.toString()) {
        return sendResponse(
          res,
          403,
          false,
          "Forbidden: You can only edit your complaints"
        );
      }
      if (solution || status) {
        return sendResponse(
          res,
          403,
          false,
          "Students cannot update solution or status"
        );
      }

      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
    }

    if (req.user?.role === "admin") {
      if (solution) {
        updateData.solution = solution;
        updateData.status = status || "Resolved";
      }
      if (status) updateData.status = status;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      "Complaint updated successfully",
      updatedComplaint
    );
  }
);

// Search Complaints
export const searchComplaints = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, status, title } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" }; // case-insensitive search

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    sendResponse(res, 200, true, "Complaints search results", complaints);
  }
);
