
"use client";

import { toast } from "sonner";
import { Form, Response } from "@/types/api-types";
import { FORM_ENDPOINTS, RESPONSE_ENDPOINTS, ANALYTICS_ENDPOINTS } from "@/lib/api-config";

const TOKEN_STORAGE_KEY = "triddle_auth_token";

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return { "Content-Type": "application/json" };
  }
  
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Form API functions
export const formService = {
  // Get all forms
  getAllForms: async (): Promise<Form[]> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.forms, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Get form by ID
  getFormById: async (id: string): Promise<Form> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.form(id), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch form");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Create form
  createForm: async (formData: Partial<Form>): Promise<Form> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.forms, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create form");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Update form
  updateForm: async (id: string, formData: Partial<Form>): Promise<Form> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.form(id), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update form");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Delete form
  deleteForm: async (id: string): Promise<void> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.form(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete form");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Publish form
  publishForm: async (id: string): Promise<Form> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.publish(id), {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to publish form");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Archive form
  archiveForm: async (id: string): Promise<Form> => {
    try {
      const response = await fetch(FORM_ENDPOINTS.archive(id), {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to archive form");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
};

// Response API functions
export const responseService = {
  // Get responses for a form
  getFormResponses: async (formId: string): Promise<Response[]> => {
    try {
      const response = await fetch(RESPONSE_ENDPOINTS.formResponses(formId), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch responses");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Get specific response
  getResponseById: async (id: string): Promise<Response> => {
    try {
      const response = await fetch(RESPONSE_ENDPOINTS.response(id), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Delete response
  deleteResponse: async (id: string): Promise<void> => {
    try {
      const response = await fetch(RESPONSE_ENDPOINTS.response(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete response");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
};

// Analytics API functions
export const analyticsService = {
  // Get form analytics
  getFormAnalytics: async (formId: string) => {
    try {
      const response = await fetch(ANALYTICS_ENDPOINTS.formAnalytics(formId), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Get field analytics
  getFieldAnalytics: async (formId: string) => {
    try {
      const response = await fetch(ANALYTICS_ENDPOINTS.fieldAnalytics(formId), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch field analytics");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Get visit analytics
  getVisitAnalytics: async (formId: string) => {
    try {
      const response = await fetch(ANALYTICS_ENDPOINTS.visitAnalytics(formId), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch visit analytics");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
  
  // Export form responses
  exportResponses: async (formId: string) => {
    try {
      const response = await fetch(ANALYTICS_ENDPOINTS.exportResponses(formId), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to export responses");
      }
      
      return await response.blob();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
      throw error;
    }
  },
};
