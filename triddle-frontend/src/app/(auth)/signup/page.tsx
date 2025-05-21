"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";
// Using the provided interface
import { RegisterData } from "@/types/api-types";

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      
      const success = await signup(data);
      
      if (success) {
        toast.success("Account created successfully!");
        reset(); // Reset form after successful submission
        router.push("/login");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar */}
      <div className="hidden text-white md:flex md:w-1/2 bg-sidebar flex-col items-center justify-center p-12">
        <Logo size="large" />
      </div>
      
      {/* Right content area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block font-medium">
                Full Name
              </label>
              <Input 
                id="fullName" 
                type="text"
                placeholder="John Doe" 
                disabled={isLoading}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters long",
                  },
                })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">
                Email Address
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@mail.com" 
                disabled={isLoading}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">
                Password
              </label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={isPasswordVisible ? "text" : "password"} 
                  placeholder="••••••••••••"
                  className="pr-10"
                  disabled={isLoading}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-sm">
              Already have an Account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}