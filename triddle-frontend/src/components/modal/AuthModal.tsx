"use client"

import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  primaryColor?: string;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onAuthSuccess,
  primaryColor = "#4F46E5" 
}: AuthModalProps) {
  const { login, signupWithAutoLogin, isLoading } = useAuth();
  
  const [view, setView] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Generate CSS variables for dynamic styling
  const cssVars = {
    "--primary-color": primaryColor,
    "--primary-color-light": `${primaryColor}33`,
  } as React.CSSProperties;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRememberMe(false);
  };

  const toggleView = () => {
    setView(view === "login" ? "signup" : "login");
    resetForm();
  };

  const handleFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Generate field styles based on focus state
  const getFieldStyles = (fieldId: string) => {
    return {
      borderColor: focusedField === fieldId ? primaryColor : "",
      boxShadow: focusedField === fieldId ? `0 0 0 2px ${primaryColor}33` : "",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let success = false;
      
      if (view === "login") {
        if (!email || !password) {
          toast.error("Please enter both email and password");
          return;
        }
        
        // Use the same login pattern as in your Login.tsx
        const credentials = {
          email,
          password,
          rememberMe
        };
        
        success = await login(credentials);
        
        if (success) {
          toast.success("Login successful!");
          if (onAuthSuccess) {
            onAuthSuccess();
          } else {
            onClose();
          }
        } else {
          toast.error("Invalid email or password.");
        }
      } else {
        if (!name || !email || !password) {
          toast.error("Please fill in all fields");
          return;
        }
        
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters long");
          return;
        }
        
        // Use the same signup pattern as in your Signup.tsx
        const credentials = {
          name,
          email,
          password
        };
        
        success = await signupWithAutoLogin(credentials);
        
        if (success) {
          toast.success("Account created successfully!");
          setView("login"); // Switch to login view after successful signup
        } else {
          toast.error("Failed to create account. Please try again.");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(view === "login" ? "Login failed" : "Signup failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" style={cssVars}>
        <DialogHeader>
          <DialogTitle style={{ color: primaryColor }}>
            {view === "login" ? "Login" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {view === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                style={getFieldStyles('name')}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@mail.com"
              disabled={isLoading}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              style={getFieldStyles('email')}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {view === "login" && (
                <a 
                  href="#" 
                  className="text-sm hover:underline"
                  style={{ color: primaryColor }}
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pr-10"
                disabled={isLoading}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                style={getFieldStyles('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isLoading}
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {view === "login" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
                style={{ 
                  borderColor: rememberMe ? primaryColor : undefined,
                  background: rememberMe ? primaryColor : undefined 
                }}
              />
              <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              style={{ 
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                color: "#fff"
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {view === "login" ? "Logging in..." : "Signing up..."}
                </span>
              ) : (
                view === "login" ? "Login" : "Sign Up"
              )}
            </Button>
            
            <div className="text-center mt-2">
              <button 
                type="button" 
                onClick={toggleView}
                className="text-sm font-medium hover:underline"
                disabled={isLoading}
                style={{ color: primaryColor }}
              >
                {view === "login" ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}