"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/layout/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/lib/api-service";

export default function ResetPassword({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // Get token from URL params
    if (params.token) {
      setToken(params.token);
    }
  }, [params.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
   
    // Validation
    if (!password) {
      setError("Please enter your new password");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
   
    try {
      setIsSubmitting(true);
      await authService.resetPassword(token, password);
      setSuccess("Password has been reset successfully!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError((err as Error).message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="mt-2 text-gray-600">
              Enter your new password below
            </p>
          </div>
         
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
         
          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p>{success}</p>
                <p className="mt-2">Redirecting to login page...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block font-medium">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
             
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
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