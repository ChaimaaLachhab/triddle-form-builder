"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";

// Define the form data type to match the LoginCredentials type
type FormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Include rememberMe in the credentials
    const credentials = {
      email: data.email,
      password: data.password,
      rememberMe: rememberMe,
    };

    const success = await login(credentials);
    if (success) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid email or password.");
    }
    
    // if (success) {
    //   router.push("/dashboard");
    // }
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
            <h1 className="text-2xl font-bold">Login</h1>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="relative">
                <Input 
                  id="password" 
                  type={isPasswordVisible ? "text" : "password"} 
                  placeholder="••••••••••••"
                  className="pr-10"
                  disabled={isLoading}
                  {...register("password", {
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 6,
                      message: "Le mot de passe doit contenir au moins 6 caractères",
                    },
                  })}
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {authError && (
              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{authError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-gray-500 text-sm">or</span>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/signup" className="w-full inline-block">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}