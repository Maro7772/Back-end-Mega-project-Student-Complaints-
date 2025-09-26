import jwt from "jsonwebtoken";
import { JWT_SECRET , REFRESH_SECRET} from "./validateEnv";


export const generateAccessToken = (user: any) =>
    jwt.sign({ id: user._id, role: user.role }, JWT_SECRET  , { expiresIn: "15m" });


export const generateRefreshToken = (user: any) =>
    jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET , { expiresIn: "7d"  });


// export const generateResetToken = function(user: any) {
//    const resetToken = crypto.randomBytes(32).toString('hex');

//   user.resetPassword = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   user.resetPasswordExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

//   return resetToken;
// };

 export const verifyResetToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
};

