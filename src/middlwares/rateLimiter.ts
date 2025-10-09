import rateLimit from "express-rate-limit";
import crypto from "crypto";

const createLimiter = (_key = "", useEmail = false) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4, // 4 requests per 15 minutes
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return (
        // const baseKey = req.body?.email || req.ip;
        // const hashedKey = crypto.createHash("sha256").update(baseKey).digest("hex");
        // return `${_key}${hashedKey}`; // overhead if it is normal route ex: /home the ip address which is not pii will also be hashed every time
        _key +
        (useEmail
          ? crypto
              .createHash("sha256")
              .update(req.body?.email || req.ip)
              .digest("hex")
          : req.ip)
      );
    }, // Use email or IP as the key (security considerations)

    // store: (need to download doker first )
  });

export const loginLimiter = createLimiter("login:", true); //"/login is a Prefix ex: if email = omar@gmail.com so its key: login:omar@gmail.com"
export const signupLimiter = createLimiter("signup:", true);
export const forgotPasswordLimiter = createLimiter("forgot-password:", true);
export const resetPasswordLimiter = createLimiter("reset-password:", true);

// login rate limiter
// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 دقيقة
//   max: 5, // 5 محاولات بس
//   message: { message: LimiterErrorMassage },
//   standardHeaders: true,
//   keyGenerator: (req) => (req.body?.email ? req.body.email : req.ip), // Use email or IP as the key (security considerations)
//   identifier: "LoginLimiter",
//   legacyHeaders: false,
// });

// // signup rate limiter
// export const signupLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 دقيقة
//   max: 5, // 5 محاولات بس
//   message: { message: LimiterErrorMassage },
//   standardHeaders: true,
//   identifier: "SignupLimiter",
//   legacyHeaders: false,
// });

// // forgot password limiter
// export const forgotPasswordLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 دقيقة
//   max: 5, // 5 مرات بس خلال 15 دقيقة
//   message: { message: LimiterErrorMassage },
//   keyGenerator: (req) => (req.body?.email ? req.body.email : req.ip),
//   standardHeaders: true,
//   identifier: "ForgotPasswordLimiter",
//   legacyHeaders: false,
// });

// // reset password limiter
// export const resetPasswordLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 دقيقة
//   max: 5, // 5مرات بس خلال 15 دقيقة
//   message: { message: LimiterErrorMassage },
//   standardHeaders: true,
//   identifier: "ResetPasswordLimiter",
//   legacyHeaders: false,
// });
