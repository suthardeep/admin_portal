import React, { useState } from "react";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import Logo from "@/components/base/Logo";
import { toast } from "@/components/toast/Sonner";
import { useNavigate } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes"; 

import { TokenUtil } from '@/utils/tokenUtil'

import { useLoginMutation } from "./api/queryHooks";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginSchema } from "./schemas/login.schema"; 

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Get the setAuth function from the Auth Store
  const { setAuth } = useAuthStore(); 
  
  // --- State ---
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  
  // Local error state for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- TanStack Query Mutation ---
  const loginMutation = useLoginMutation();

  // --- Handlers ---

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value); 
    if (errors.email) { 
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.email; 
        return newErr;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value); 
    if (errors.password) { 
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.password; 
        return newErr;
      });
    }
  };

  const handleLogin = () => {
    const result = LoginSchema.safeParse({ email, password }); 
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors); 
      return;
    }

    // 2. API Call (Login)
    setErrors({}); 
    
    loginMutation.mutate(
      { email, password }, 
      {
        onSuccess: (res) => {
          const userData = res.data;

          console.log("res" , res.data)
          
          // 3. Store Access Token in localStorage
          TokenUtil.setToken(res.data.accessToken); 
          
          // 4. Store user details and set isLoggedIn in Zustand
          if (userData.user) {
            setAuth(userData.user);
          }

          toast.success("Login Successful!");
          
          // Use window.location for full page reload to ensure router context updates
          window.location.href = ROUTES.DASHBOARD;
        },
        onError: (error) => {
          const errorMessage = (error as { message?: string })?.message || "Invalid credentials or login failed.";
          toast.error(errorMessage);
          setErrors({ password: "Invalid email or password" });
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email && password && !loginMutation.isPending) {
      handleLogin();
    }
  };

  return (
    <div className="w-full px-5 py-6 sm:px-6 md:px-8 lg:px-10 flex flex-col">
      <div className="mb-6 shrink-0">
        <div className="mb-16">
          <Logo height={90} />
        </div>
        <div>
          <h1 className="mb-2 text-base-content text-2xl font-semibold sm:text-4xl">
            Log In
          </h1>
          <p className="text-sm sm:text-base font-normal text-body-content/80">
            Establish your business and connect with millions throughout India.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-6 animate-in fade-in duration-300">
          <Input
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            value={email} 
            onChange={handleEmailChange} 
            error={errors.email} 
            required
            fullWidth
            inputSize="lg"
            disabled={loginMutation.isPending}
            onKeyPress={handleKeyPress}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password} 
            onChange={handlePasswordChange} 
            error={errors.password} 
            required
            fullWidth
            inputSize="lg"
            togglePassword
            disabled={loginMutation.isPending}
            onKeyPress={handleKeyPress}
          />

          <Button
            onClick={handleLogin}
            isLoading={loginMutation.isPending} 
            disabled={!email || !password || loginMutation.isPending}
            fullWidth
            color="primary"
            size="lg"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;