import { User } from "@/types/user";

export type LoginStep = "INPUT_EMAIL" | "INPUT_OTP";

export interface LoginResponseData {
  accessToken: string; 
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: LoginResponseData;
}

// New: Email/Password Login
export interface LoginPayload {
  email: string;
  password: string;
}

// Keep OTP types if you still need them for other flows
export interface SendOtpPayload {
  email: string; 
}

export interface SendOtpData {
  phone: string;
  isNewUser: boolean;
  expiresIn: number;
}

export interface SendOtpResponse {
  statusCode: number;
  message: string;
  data: SendOtpData | null;
}

export interface VerifyOtpPayload {
  email: string; 
  otp: string;
}


export interface LoginState {
  isLoading: boolean;
  email: string;
  password: string;
}