"use client";
import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FormBuilder } from "@/components/forms/FormBuilder";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewFormPage() {
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [publicUrl, setPublicUrl] = useState("");

  const handlePublish = () => {
    toast.success("Form published successfully");
    // Après création, vous pourriez rediriger vers la page d'édition
  };

  const handlePreview = () => {
    toast.info("Form preview mode activated");
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row lg:flex-row justify-between gap-4">
            <div className="flex flex-col items-start">
              <h1 className="text-lg md:text-lg lg:text-xl font-bold">
                Create New Form
              </h1>
              <div className="flex items-center">
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700"
                >
                  <span className="mr-1">Back to Forms</span>
                  <ChevronRight className="h-4 w-4 mr-1" />
                </Link>
                <span className="text-sm">Create New Form</span>
              </div>
            </div>

            <div className="flex space-x-2 m-auto">
              <Button
                variant="outline"
                className="border-primary hover:text-black hover:bg-blue-50"
                onClick={handlePreview}
              >
                Preview Form
              </Button>
              <Button size="sm" onClick={handlePublish}>
                Publish Form
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <FormBuilder initialForm={null} />
        </div>
      </div>
    </SidebarLayout>
  );
}
