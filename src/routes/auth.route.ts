import express from "express"
import { signup, login, logout ,forgotPassword, resetPassword, refreshToken, verifyCode } from "../controllers/auth.controller";
import { forgotPasswordLimiter, loginLimiter, resetPasswordLimiter } from "../middlwares/rateLimiter";


const router = express.Router();

// Authentication
router.post("/signup",   signup);
router.post("/login",loginLimiter, login);

// Password management
router.post("/forgot-password",forgotPasswordLimiter, forgotPassword);
router.post("/reset-password" , resetPasswordLimiter , resetPassword);
router.post("/codeVerification" , verifyCode);

// Session management
router.post("/logout",logout);
router.post("/refresh-token", refreshToken);


export default router;