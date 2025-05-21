"use client";

import * as React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Answer } from "@/types/api-types";
import { FormDisplay } from "@/components/forms/FormDisplay";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { formService, responseService } from "@/lib/api-service";
import { toast } from "sonner";
import AuthModal from "@/components/modal/AuthModal";

export default function PublicFormPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const navigate = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<Answer[] | null>(null);
  
  // Fetch form data using slug/id
  const { data: form, isLoading, error } = useQuery({
    queryKey: ['public-form', id],
    queryFn: () => id ? formService.getFormById(id) : Promise.resolve(null),
  });

  // Get primary color from form settings for consistent styling
  const primaryColor = form?.settings?.theme?.primaryColor || "#4F46E5";

  const handleSubmit = async (answers: Answer[]) => {
    if (!form || !form.id) return;
    
    // Set pending answers to be used after authentication if needed
    setPendingAnswers(answers);
    setHasTriedToSubmit(true);
    
    setSubmitting(true);
    try {
      await responseService.submitFormResponse(form.id, {
        formId: form.id,
        answers,
      });

      setShowSuccess(true);
      toast.success('Your response has been submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // Check if the error is due to authentication and only show modal if user has actually clicked submit
      if (error && error.isAuthError && hasTriedToSubmit) {
        // Show authentication modal
        setShowAuthModal(true);
        toast.error('Authentication required to submit this form');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Function to handle successful authentication and retry form submission
  const handleAuthSuccess = async () => {
    if (pendingAnswers && form && form.id) {
      setSubmitting(true);
      try {
        await responseService.submitFormResponse(form.id, {
          formId: form.id,
          answers: pendingAnswers,
        });
        
        setShowSuccess(true);
        toast.success('Your response has been submitted successfully!');
      } catch (error) {
        console.error('Error submitting form after authentication:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
        setShowAuthModal(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Form Not Found</h2>
        <p className="text-gray-600 text-center">
          The form you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ 
              backgroundColor: `${primaryColor}20`,
              color: primaryColor 
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            {form.settings?.successMessage || "Your response has been successfully submitted."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-10"
      style={{ backgroundColor: form.settings?.theme?.backgroundColor || '#F9FAFE' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <FormDisplay 
            form={form} 
            onSubmit={handleSubmit} 
            isSubmitting={submitting} 
          />
        </div>
      </div>

      {/* Authentication Modal with consistent theming */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal} 
        onAuthSuccess={handleAuthSuccess}
        primaryColor={primaryColor}
      />
    </div>
  );
}