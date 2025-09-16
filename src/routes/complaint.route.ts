import express from "express"
import { createComplaint, getComplaints, deleteComplaint, updateComplaint } from "../controllers/complaint.controller";


const ComplaintsRouter = express.Router();

ComplaintsRouter.get("/", getComplaints); 
ComplaintsRouter.post("/", createComplaint);
ComplaintsRouter.delete("/:id", deleteComplaint);
ComplaintsRouter.put("/:id", updateComplaint);

export default ComplaintsRouter;