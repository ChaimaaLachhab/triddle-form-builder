"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Settings, 
  CreditCard, 
  User, 
  Key, 
  HelpCircle 
} from "lucide-react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { ArticleGrid } from "@/components/knowledge/ArticleGrid";

// Mock data for demonstration
const formCreationArticles = [
  {
    id: "create-new-form",
    title: "Steps to create a new form",
    description: "Learn how to create your first form from scratch.",
    icon: <FileText className="h-4 w-4 text-blue-500" />
  },
  {
    id: "edit-existing-form",
    title: "Steps to edit an existing form",
    description: "Make changes to forms you've already created.",
    icon: <Settings className="h-4 w-4 text-blue-500" />
  },
  {
    id: "edit-contact-form",
    title: "Steps to edit a contact form",
    description: "Customize your contact forms for better conversions.",
    icon: <FileText className="h-4 w-4 text-blue-500" />
  },
  {
    id: "edit-template",
    title: "Steps to edit a template",
    description: "Start with a template and make it your own.",
    icon: <Settings className="h-4 w-4 text-blue-500" />
  },
  {
    id: "complex-forms",
    title: "Creating complex forms",
    description: "Learn about conditional logic, file uploads, and more.",
    icon: <FileText className="h-4 w-4 text-blue-500" />
  }
];

const paymentArticles = [
  {
    id: "payment-failed",
    title: "Payment shows failed",
    description: "Troubleshoot issues with payment processing.",
    icon: <CreditCard className="h-4 w-4 text-red-500" />
  },
  {
    id: "refund-policy",
    title: "About refund policy",
    description: "Details about our refund process and conditions.",
    icon: <CreditCard className="h-4 w-4 text-red-500" />
  },
  {
    id: "card-payments",
    title: "Privacy of card payments",
    description: "How we keep your payment information secure.",
    icon: <CreditCard className="h-4 w-4 text-red-500" />
  },
  {
    id: "premium-account",
    title: "Upgrading to premium account",
    description: "Steps to upgrade and benefits of premium features.",
    icon: <CreditCard className="h-4 w-4 text-red-500" />
  }
];

const accountArticles = [
  {
    id: "forgot-password",
    title: "What to do when forgetting password",
    description: "Reset your password and recover access to your account.",
    icon: <Key className="h-4 w-4 text-purple-500" />
  },
  {
    id: "dark-mode",
    title: "How to activate dark mode",
    description: "Switch to dark mode for comfortable viewing.",
    icon: <User className="h-4 w-4 text-purple-500" />
  },
  {
    id: "2fa",
    title: "Enable / Disable 2-step verification",
    description: "Add an extra layer of security to your account.",
    icon: <Key className="h-4 w-4 text-purple-500" />
  }
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real app, this would actually search the knowledge base
  };

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground mb-6">
            Explore how our Form Builder can work for you
          </p>
          
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 py-6"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-1 top-1">
              Search
            </Button>
          </form>
        </div>
        
        <div className="space-y-12">
          <ArticleGrid 
            title="Form Creation" 
            articles={formCreationArticles} 
          />
          
          <ArticleGrid 
            title="Payments" 
            articles={paymentArticles} 
          />
          
          <ArticleGrid 
            title="Account" 
            articles={accountArticles} 
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
