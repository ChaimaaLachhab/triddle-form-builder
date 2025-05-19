"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsesList } from "@/components/forms/ResponsesList";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { formService, responseService, analyticsService } from "@/lib/api-service";
import { toast } from "sonner";
import { FormBuilder } from "@/components/forms/FormBuilder";

export default function FormResponsesPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const navigate = useRouter();
  
  // Fetch form data
  const { data: form, isLoading: isFormLoading } = useQuery({
    queryKey: ['form', id],
    queryFn: () => id ? formService.getFormById(id) : Promise.resolve(null),
  });

  // Fetch responses data
  const { data: responses, isLoading: isResponsesLoading } = useQuery({
    queryKey: ['formResponses', id],
    queryFn: () => id ? responseService.getFormResponses(id) : Promise.resolve([]),
  }); 

  // Function to handle download
  const handleDownload = async () => {
    if (!id) return;
    try {
      const blob = await analyticsService.exportResponses(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-responses-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download responses:", error);
      toast.error("Failed to download responses");
    }
  };

  // Handle form publishing
  const handlePublish = () => {
    if (!id) return;
    formService.publishForm(id)
      .then(() => {
        toast.success("Form published successfully");
      })
      .catch((error) => {
        console.error("Failed to publish form:", error);
        toast.error("Failed to publish form");
      });
  };

  const [activeTab, setActiveTab] = useState<"form" | "responses">("form");

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col items-start">
            <h1 className="font-bold text-lg md:text-1lx lg:text-2xl">
              {isFormLoading ? "Loading..." : form?.title || "Form Details"}
            </h1>
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                <span className="mr-1">My Forms</span>
                <ChevronRight className="h-4 w-4 mr-1" />
              </Link>
              <span className="text-sm">{isFormLoading ? "Loading..." : form?.title}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            {activeTab === "form" && (
              <>
                <Button 
                  variant="outline" 
                  className="border-primary hover:text-black hover:bg-blue-50"
                  onClick={() => navigate.push(`/forms/${id}/preview`)}>
                  Preview
                </Button>
                <Button onClick={handlePublish}>
                  Publish Form
                </Button>
              </>
            )}
            {activeTab === "responses" && (
              <Button onClick={handleDownload} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download Data
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="responses">
          <TabsList>
            <TabsTrigger value="responses">
              Responses ({responses?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="form">Form Design</TabsTrigger>
          </TabsList>
          
          <TabsContent value="responses" className="mt-6">
            <div className="space-y-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search responses..." className="pl-8" />
              </div>
              
              {isResponsesLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-64 bg-muted rounded"></div>
                </div>
              ) : (
                <ResponsesList responses={responses || []} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="form">
            {isFormLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-64 bg-muted rounded"></div>
              </div>
            ) : (
              <FormBuilder initialForm={form} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}