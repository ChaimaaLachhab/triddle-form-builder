"use client";

import { toast } from "sonner";
import { Form, Response, User } from "@/types/api-types";
import { 
  AUTH_ENDPOINTS, 
  FORM_ENDPOINTS, 
  RESPONSE_ENDPOINTS, 
  ANALYTICS_ENDPOINTS,
  API_BASE_URL
} from "@/lib/api-config";

const TOKEN_STORAGE_KEY = "triddle_auth_token";

// Define error interface
interface ApiError extends Error {
  status?: number;
  isAuthError?: boolean;
}

// Auth status check
export const authService = {
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  handleAuthError: () => {
    // This will be called when auth errors occur
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      // We don't force redirect here to avoid interrupting the user flow
      // Instead, we'll show a modal on the component level
      return false;
    }
  }
};

// Helper function to get headers with auth token
const getAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') {
    return { "Content-Type": "application/json" };
  }
  
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Define options interface for apiFetch
interface ApiFetchOptions extends RequestInit {
  responseType?: 'json' | 'blob';
}

// Custom fetch wrapper to handle auth errors consistently
const apiFetch = async (url: string, options: ApiFetchOptions = {}): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: options.headers || getAuthHeaders(),
    });
    
    // Handle authentication errors
    if (response.status === 401) {
      authService.handleAuthError();
      throw {
        status: 401,
        message: "Authentication required",
        isAuthError: true
      } as ApiError;
    }
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: `Request failed with status ${response.status}`,
        isAuthError: response.status === 401
      } as ApiError;
    }
    
    // For non-JSON responses (like blobs)
    if (options.responseType === 'blob') {
      return await response.blob();
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Enhance error with auth info if needed
    const apiError = error as ApiError;
    if (apiError.status === 401) {
      apiError.isAuthError = true;
    }
    throw apiError;
  }
};

// Form API functions
export const formService = {
  // Get all forms
  getAllForms: async (): Promise<Form[]> => {
    try {
      const data = await apiFetch(FORM_ENDPOINTS.forms);
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch forms";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Get form by ID
  getFormById: async (id: string): Promise<Form> => {
    try {
      const data = await apiFetch(FORM_ENDPOINTS.form(id));
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch form";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Create form
  createForm: async (formData: Partial<Form>): Promise<Form> => {
    try {
      // Ensure the form has the required structure
      const completeFormData: Partial<Form> = {
        title: formData.title || "Untitled Form",
        description: formData.description || "",
        fields: formData.fields || [],
        logicJumps: formData.logicJumps || [],
        settings: formData.settings || {
          theme: {
            primaryColor: "#4F46E5",
            backgroundColor: "#FFFFFF",
            fontFamily: "Inter, sans-serif"
          },
          progressBar: {
            show: true,
            type: "bar"
          },
          submitButton: {
            text: "Submit"
          },
          successMessage: "Thank you for your submission!"
        }
      };
      
      const data = await apiFetch(FORM_ENDPOINTS.forms, {
        method: "POST",
        body: JSON.stringify(completeFormData),
      });
      
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to create form";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Update form
  updateForm: async (id: string, formData: Partial<Form>): Promise<Form> => {
    try {
      const data = await apiFetch(FORM_ENDPOINTS.form(id), {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to update form";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Delete form
  deleteForm: async (id: string): Promise<void> => {
    try {
      await apiFetch(FORM_ENDPOINTS.form(id), {
        method: "DELETE",
      });
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to delete form";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Publish form
  publishForm: async (id: string): Promise<Form> => {
    try {
      const data = await apiFetch(FORM_ENDPOINTS.publish(id), {
        method: "PUT",
      });
      
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to publish form";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Archive form
  archiveForm: async (id: string): Promise<Form> => {
    try {
      const data = await apiFetch(FORM_ENDPOINTS.archive(id), {
        method: "PUT",
      });
      
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to archive form";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Upload file for form
  uploadFile: async (id: string, file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(FORM_ENDPOINTS.upload(id), {
        method: "POST",
        headers: {
          // Don't set Content-Type as it will be set automatically with boundary for FormData
          ...(authService.isAuthenticated() ? { 
            Authorization: `Bearer ${authService.getToken()}` 
          } : {})
        },
        body: formData,
      });
      
      if (response.status === 401) {
        authService.handleAuthError();
        throw {
          status: 401,
          message: "Authentication required",
          isAuthError: true
        } as ApiError;
      }
      
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to upload file";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
};

// Response API functions
export const responseService = {
  // Get responses for a form
  getFormResponses: async (formId: string): Promise<Response[]> => {
    try {
      const data = await apiFetch(RESPONSE_ENDPOINTS.formResponses(formId));
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch responses";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Get specific response
  getResponseById: async (id: string): Promise<Response> => {
    try {
      const data = await apiFetch(RESPONSE_ENDPOINTS.response(id));
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch response";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Delete response
  deleteResponse: async (id: string): Promise<void> => {
    try {
      await apiFetch(RESPONSE_ENDPOINTS.response(id), {
        method: "DELETE",
      });
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to delete response";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Submit form response
  submitFormResponse: async (formId: string, responseData: any, files?: File[]): Promise<any> => {
    try {
      let response;
      
      // If there are files to upload, use FormData
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Add response data as JSON string
        formData.append('answers', JSON.stringify(responseData.answers));
        if (responseData.visitId) formData.append('visitId', responseData.visitId);
        if (responseData.isComplete !== undefined) formData.append('isComplete', String(responseData.isComplete));
        
        // Add files
        files.forEach((file) => {
          formData.append(`file`, file);
        });
        
        response = await fetch(RESPONSE_ENDPOINTS.formResponses(formId), {
          method: "POST",
          headers: {
            // Don't set Content-Type as it will be set automatically with boundary
            ...(authService.isAuthenticated() ? { 
              Authorization: `Bearer ${authService.getToken()}` 
            } : {})
          },
          body: formData,
        });
      } else {
        // If no files, use JSON
        response = await fetch(RESPONSE_ENDPOINTS.formResponses(formId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authService.isAuthenticated() ? { 
              Authorization: `Bearer ${authService.getToken()}` 
            } : {})
          },
          body: JSON.stringify(responseData),
        });
      }
      
      if (response.status === 401) {
        authService.handleAuthError();
        throw {
          status: 401,
          message: "Authentication required",
          isAuthError: true
        } as ApiError;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to submit form response: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (!apiError.isAuthError) {
        const message = apiError.message || "Failed to submit form response";
        toast.error(message);
      }
      throw apiError;
    }
  },
};

// Analytics API functions
export const analyticsService = {
  // Get form analytics
  getFormAnalytics: async (formId: string) => {
    try {
      const data = await apiFetch(ANALYTICS_ENDPOINTS.formAnalytics(formId));
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch analytics";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Get field analytics
  getFieldAnalytics: async (formId: string) => {
    try {
      const data = await apiFetch(ANALYTICS_ENDPOINTS.fieldAnalytics(formId));
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch field analytics";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Get visit analytics
  getVisitAnalytics: async (formId: string) => {
    try {
      const data = await apiFetch(ANALYTICS_ENDPOINTS.visitAnalytics(formId));
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch visit analytics";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Export form responses
  exportResponses: async (formId: string, format: 'json' | 'csv' = 'json') => {
    try {
      const url = `${ANALYTICS_ENDPOINTS.exportResponses(formId)}?format=${format}`;
      
      // Handle blob responses differently
      if (format === 'csv') {
        return await apiFetch(url, { responseType: 'blob' });
      } else {
        const data = await apiFetch(url);
        return data;
      }
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to export responses";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
};

// User API functions
export const userService = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/v1/users`);
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch users";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Get user by ID (admin only)
  getUserById: async (id: string): Promise<User> => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/v1/users/${id}`);
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to fetch user";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Create user (admin only)
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
  }): Promise<User> => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/v1/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
      
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to create user";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Update user (admin only)
  updateUser: async (id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'USER' | 'ADMIN';
  }): Promise<User> => {
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/v1/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      
      return data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to update user";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
  
  // Delete user (admin only)
  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiFetch(`${API_BASE_URL}/api/v1/users/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to delete user";
      if (!apiError.isAuthError) {
        toast.error(message);
      }
      throw apiError;
    }
  },
};