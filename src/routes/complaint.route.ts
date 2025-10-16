import express from "express";
import {
  createComplaint,
  getComplaints,
  deleteComplaint,
  updateComplaint,
  searchComplaints,
} from "../controllers/complaint.controller";
import { authMiddleware } from "../middlwares/auth.middlware";
import { adminGuardMiddleware } from "../middlwares/admin-guard-middleware";

const complaintRouter = express.Router();

/* ============================
    Student Endpoints
   ============================ */
complaintRouter.post("/complaints", authMiddleware, createComplaint);
complaintRouter.patch("/complaints/:id", authMiddleware, updateComplaint);
complaintRouter.delete("/complaints/:id", authMiddleware, deleteComplaint);

/* ============================
    Student Endpoints && Admin Endpoints
   ============================ */
complaintRouter.get("/complaints", authMiddleware, getComplaints);
/* ============================
    Admin Endpoints
   ============================ */

complaintRouter.get(
  "/complaints/search",
  authMiddleware,
  adminGuardMiddleware,
  searchComplaints
);
complaintRouter.patch(
  "/complaints/:id",
  authMiddleware,
  adminGuardMiddleware,
  updateComplaint
);
complaintRouter.delete(
  "/complaints/:id",
  authMiddleware,
  adminGuardMiddleware,
  deleteComplaint
);

export default complaintRouter;
