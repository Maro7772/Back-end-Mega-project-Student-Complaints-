import { object, string } from "yup";


export const createUserValidator = object({
  fullName: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: string().oneOf(["student", "admin"], "Role must be either 'student' or 'admin'").required("Role is required"),
});

export const loginUserValidator = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string().required("Password is required"),
});
// Add to your existing Validators
export const forgotPasswordValidator = object({
  email: string().email("Invalid email").required("Email is required"),
});

export const resetPasswordValidator = object({
  email: string().email("Invalid email").required("Email is required"),
  code: string().length(6, "Code must be 6 digits").required("Verification code is required"),
  password: string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
