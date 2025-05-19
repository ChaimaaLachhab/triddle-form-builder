"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Cloud, Database, FileText, PanelRight, Check } from "lucide-react";
import MainNav from "@/components/layout/MainNav";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/layout/FeatureCard";
import PricingCard from "@/components/layout/PricingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // For the quick signup form, we'll just capture email and redirect to full registration
    router.push(`/signup?email=${encodeURIComponent(email)}`);
    setEmail("");
  };
  
  const handleFullSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    // Use the register function from auth context
    const success = await signup({
      name: "", // This would need to be added to the form
      email,
      password,
    });
    
    if (success) {
      router.push("/dashboard");
    }
    
    // Form is reset on success by the auth context
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent. We'll get back to you soon!");
    // Reset form in a real application
  };

  // If user is already logged in, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    router.push("/dashboard");
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-18 lg:pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex justify-center animate-fade-in">
            <div className="w-60 h-60 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={80} className="text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Create custom FORMS with our <br className="hidden md:block" />
            easy to use Triddle
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Get started by creating an account for FREE!
          </p>
          
          <form onSubmit={handleSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Input 
              type="email" 
              placeholder="Enter Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" className="whitespace-nowrap" disabled={isLoading}>
              {isLoading ? "Loading..." : "Get Started"}
            </Button>
          </form>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-4" id="features">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<FileText size={24} />}
              title="Easy Builder"
              description="Build beautiful forms with our intuitive drag and drop form builder"
            />
            <FeatureCard 
              icon={<PanelRight size={24} />}
              title="Easy Embed"
              description="Embed your forms on any website with a simple copy and paste"
            />
            <FeatureCard 
              icon={<Database size={24} />}
              title="Export Responses"
              description="Export form responses to CSV or JSON for further analysis"
            />
            <FeatureCard 
              icon={<Cloud size={24} />}
              title="Always on Cloud"
              description="Your forms and responses are always available and backed up"
            />
          </div>

          <div className="mt-20 flex justify-center">
            <img 
              src="https://duonut.com/_next/image?url=%2Fimages%2Fblogs%2Fform-builder.png&w=3840&q=75" 
              alt="Form Builder Interface" 
              className="rounded-lg shadow-lg max-w-4xl w-full"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-4" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <PricingCard 
              title="Starter"
              price="FREE"
              features={[
                "5 Forms",
                "Simple Form Builder",
                "Embed Option",
                "Sharable Link",
                "Email Support",
              ]}
              ctaText="Start Free"
              onCtaClick={() => router.push("/register")}
            />
            
            <PricingCard 
              title="Premium"
              price="$ 4.99"
              features={[
                "Unlimited Forms",
                "Everything from FREE plan",
                "24/7 Voice Call Support",
                "24/7 Chat Support",
                "Email Support",
              ]}
              isPrimary
              ctaText="Upgrade Now"
              onCtaClick={() => router.push("/register?plan=premium")}
            />
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-gray-50 px-4" id="contact">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Contact</h2>
          
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input id="name" placeholder="John Doe" className="w-full" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="john@example.com" className="w-full" />
                </div>
              </div>
              
              <div>
                <label htmlFor="enquiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Enquiry Type
                </label>
                <select 
                  id="enquiry" 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="billing">Billing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Get started by creating an account for FREE!</h2>
          <p className="mb-8 text-white/80 text-lg">Join thousands of users creating beautiful forms today.</p>
          
          <form onSubmit={handleSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Enter Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/60"
              disabled={isLoading}
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap" disabled={isLoading}>
              {isLoading ? "Loading..." : "Let's Do IT!"}
            </Button>
          </form>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}