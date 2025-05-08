import express from "express"
import { createComplaint, getComplaints, deleteComplaint, updateComplaint } from "../controllers/complaint.controller";


const ComplaintsRouter = express.Router();

ComplaintsRouter.get("/complaints", getComplaints); 
ComplaintsRouter.post("/complaints", createComplaint);
ComplaintsRouter.delete("/complaints/:id", deleteComplaint);
ComplaintsRouter.put("/complaints/:id", updateComplaint);

export default ComplaintsRouter;