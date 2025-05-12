import { object, string } from "yup";


export const createUserSchema = object({
  fullName: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: string().oneOf(["student", "admin"], "Role must be either 'student' or 'admin'").required("Role is required"),
});

export const loginUserSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string().required("Password is required"),
});
// Add to your existing schemas
export const forgotPasswordSchema = object({
  email: string().email("Invalid email").required("Email is required"),
});

export const resetPasswordSchema = object({
  token: string().required("Token is required"),
  password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
});