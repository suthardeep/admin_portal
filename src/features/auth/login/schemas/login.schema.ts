import { z } from "zod";

const mobileRegex = /^[6-9]\d{9}$/;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const OtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;