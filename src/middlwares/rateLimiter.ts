import rateLimit from "express-rate-limit";

// login rate limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 3, // 3 محاولات بس
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// forgot password limiter
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 3, // 3 مرات بس خلال 15 دقيقة
  message: { message: "Too many reset requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// reset password limiter
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 3, // 3 مرات بس خلال 15 دقيقة
  message: { message: "Too many reset requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});