import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!fullName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    // In a real app, we would create account with the backend here
    toast.success("Account created successfully!");
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
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block font-medium">
                Full Name
              </label>
              <Input 
                id="fullName" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
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
            
            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium">
                Password
              </label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={isPasswordVisible ? "text" : "password"} 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>
            
            <Button type="submit" className="w-full">
              Login
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
