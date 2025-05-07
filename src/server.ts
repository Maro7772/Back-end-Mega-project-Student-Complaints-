import "dotenv/config"; // Load environment variables from .env file
import express, { Request, Response } from "express";
import { User } from "./models/user.model";
import Complaint from "./models/complaint.model";
import env from "./util/validateEnv";;
import { connectDB  } from "./config/db";
import router from "./routes/auth.route";

const port = env.PORT;
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/complaints", async (req: Request, res: Response) => {
  try {
    const { studentId, category, description } = req.body;

    const student = await User.findById(studentId);
    if (!studentId || !category || !description) {
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
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/complaints", async (req: Request, res: Response) => {
  const complaints = await Complaint.find().populate("student").exec();
  res.status(200).json(complaints);
});

app.delete("/complaints/:id", async (req: Request, res: Response) => {
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
});

app.put("/complaints/:id", async (req: Request, res: Response) => {
  try {
    const complaintId = req.params.id;
    const { category, description, status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { category, description, status },
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
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
