"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // In a real app, we would send a password reset email
    setIsSubmitted(true);
    toast.success("Reset link sent to your email!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar */}
      <div className="hidden md:flex md:w-1/2 bg-sidebar flex-col items-center justify-center p-12">
        <Logo size="large" />
      </div>
      
      {/* Right content area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="mt-2 text-gray-600">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p>
                  We&apos;ve sent a password reset link to your email. Please check your inbox and follow the instructions.
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive an email? Check your spam folder or{" "}
                  <button 
                    type="button" 
                    className="text-primary font-medium hover:underline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <div>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium">
                  Email Address
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@mail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
              
              <div className="text-center">
                <p className="text-sm">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Back to Login
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}