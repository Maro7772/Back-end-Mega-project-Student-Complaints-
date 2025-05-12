import express from "express"
import { signup, login, logout ,forgotPassword, resetPassword, refreshToken } from "../controllers/auth.controller";
import { authMiddleware } from "../middlwares/auth.middlware";
// import { adminGuardMiddleware } from "../middlwares/admin-guard-middleware";


const router = express.Router();

router.post("/signup",   signup);
router.post("/login",authMiddleware, login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authMiddleware , resetPassword);

router.get("/logout", logout);

router.post("/refresh-token", refreshToken);

export default router;