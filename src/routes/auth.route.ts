import express from "express"
import { signup, login, logout ,forgotPassword, resetPassword, refreshToken, verifyCode } from "../controllers/auth.controller";
import { loginLimiter } from "../middlwares/rateLimiter";
// import { authMiddleware } from "../middlwares/auth.middlware";
// import { adminGuardMiddleware } from "../middlwares/admin-guard-middleware";


const router = express.Router();

router.post("/signup",   signup);
router.post("/login",loginLimiter, login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password" , resetPassword);
router.post("/codeVerification" , verifyCode);

router.post("/logout",logout);

router.post("/refresh-token", refreshToken);

// router.get("/profile", authMiddleware, getUserProfile);

export default router;