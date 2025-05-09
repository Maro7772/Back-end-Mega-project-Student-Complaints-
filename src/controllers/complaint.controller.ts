import type { Request, Response } from "express";
import Complaint from "../models/complaint.model";
import { User } from "../models/user.model";
import * as Yup from "yup";

const createComplaintSchema = Yup.object({
  name: Yup.string().required("Student Name is required"),
  category: Yup.string()
    .required("Category is required")
    .oneOf(
      ["Academic", "Non-Academic"],
      "Category must be either 'Academic' or 'Non-Academic'"
    ),
  description: Yup.string().required("Description is required")
});

export const createComplaint = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const complaintBody = await createComplaintSchema.validate(req.body, {
      abortEarly: false
    });
    const { name, category, description } = complaintBody;

    const student = await User.findOne({ fullName: name });
    if (!name || !category || !description) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    if (!["Academic", "Non-Academic"].includes(category)) {
      res.status(400).json({ message: "Invalid category value." });
      return;
    }

    const complaint = await Complaint.create({
      student: student._id,
      name: student.fullName,
      category,
      description,
      submissionDate: new Date()
    });

    res.status(201).json(complaint);
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      res.status(400).json({
        message: "Validation Failed",
        errors: err.errors
      });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await Complaint.find().populate("student").exec();
    res.status(200).json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComplaint = async (req: Request, res: Response) => {
  try {
    const complaintId = req.params.id;
    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
    if (!deletedComplaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateComplaint = async (req: Request, res: Response) => {
  try {
    const complaintId = req.params.id;
    const { category, description, status, name } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { category, description, status, name },
      { new: true }
    );

    if (!updatedComplaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }
    res.status(200).json(updatedComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
