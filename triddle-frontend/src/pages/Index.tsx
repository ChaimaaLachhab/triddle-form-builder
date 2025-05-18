import { useState } from "react";
import { ArrowRight, Cloud, Database, FileText, PanelRight, Check } from "lucide-react";
import MainNav from "@/components/layout/MainNav";
import Footer from "@/components/layout/Footer";
import FeatureCard from "@/components/layout/FeatureCard";
import PricingCard from "@/components/layout/PricingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Index() {
  const [email, setEmail] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    toast.success("Thanks for signing up! Check your email for next steps.");
    // In a real app, we would send this to the backend
    setEmail("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent. We'll get back to you soon!");
    // Reset form in a real application
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Create custom FORMS with our <br className="hidden md:block" />
            easy to use form builder
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Get started by creating an account for FREE!
          </p>
          
          <form onSubmit={handleSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Input 
              type="email" 
              placeholder="Enter Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="whitespace-nowrap">
              Get Started
            </Button>
          </form>
          
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="w-60 h-60 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={80} className="text-primary" />
              </div>
            </div>
          </div>
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
              src="/placeholder.svg" 
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
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              Let's Do IT!
            </Button>
          </form>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
