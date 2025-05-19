"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/types/api-types";
import { FormDisplay } from "@/components/forms/FormDisplay";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/lib/api-service";

export default function FormPreviewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  
  // Fetch form data
  const { data: form, isLoading, error } = useQuery({
    queryKey: ['form', id],
    queryFn: () => id ? formService.getFormById(id) : Promise.resolve(null),
  });

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="p-8 flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !form) {
    return (
      <SidebarLayout>
        <div className="p-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Form Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn&apos;t find the form you&apos;re looking for.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const shareUrl = `${form.public_url}`;

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

          <div className="flex flex-col items-start">
                      <h1 className="font-bold text-lg md:text-1lx lg:text-2xl">
                        Form Preview
                      </h1>
                      <div className="flex items-center">
                        <Link href={`/forms/${id}`} className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                          <span className="mr-1">Back to Editor</span>
                          <ChevronRight className="h-4 w-4 mr-1" />
                        </Link>
                        <span className="text-sm">{isLoading ? "Loading..." : form?.title}</span>
                      </div>
                    </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 hidden md:block">
              {form.status === "published" ? "Published" : "Draft"} Form
            </div>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Public Link
              </Button>
            </a>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div 
            className="p-4 border rounded-md mb-4 text-sm bg-gray-50"
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <span className="font-medium">Share URL:</span> 
            <code className="ml-2 p-1 bg-gray-100 rounded">{shareUrl}</code>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <FormDisplay form={form} isPreview={true} />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
