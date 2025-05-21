"use client";

import { toast } from "sonner";
import axios from "axios";
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return false;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get(AUTH_ENDPOINTS.me);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (!apiError.isAuthError) {
        const message = apiError.message || "Failed to get user information";
        toast.error(message);
      }
      throw apiError;
    }
  },

  // Update user details
  updateUserDetails: async (details: { 
    name?: string; 
    email?: string 
  }): Promise<User> => {
    try {
      const response = await api.put(AUTH_ENDPOINTS.updateDetails, details);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to update user details";
      toast.error(message);
      throw apiError;
    }
  },

  // Update password
  updatePassword: async (passwords: { 
    currentPassword: string; 
    newPassword: string 
  }): Promise<void> => {
    try {
      await api.put(AUTH_ENDPOINTS.updatePassword, passwords);
      toast.success("Password updated successfully");
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to update password";
      toast.error(message);
      throw apiError;
    }
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.forgotPassword, { email });
      toast.success("Password reset email sent");
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to request password reset";
      toast.error(message);
      throw apiError;
    }
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      await api.put(AUTH_ENDPOINTS.resetPassword(token), { password });
      toast.success("Password has been reset successfully");
    } catch (error) {
      const apiError = error as ApiError;
      const message = apiError.message || "Failed to reset password";
      toast.error(message);
      throw apiError;
    }
  }
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Handle auth errors
    if (error.response && error.response.status === 401) {
      authService.handleAuthError();
      const apiError = new Error("Authentication required") as ApiError;
      apiError.status = 401;
      apiError.isAuthError = true;
      return Promise.reject(apiError);
    }
    
    // Handle other errors
    const apiError = new Error(error.message || "Request failed") as ApiError;
    apiError.status = error.response?.status;
    apiError.isAuthError = error.response?.status === 401;
    
    return Promise.reject(apiError);
  }
);

// Form API functions
export const formService = {
  // Get all forms
  getAllForms: async (): Promise<Form[]> => {
    try {
      const response = await api.get(FORM_ENDPOINTS.forms);
      return response.data.data;
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
      const response = await api.get(FORM_ENDPOINTS.form(id));
      return response.data.data;
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
      
      const response = await api.post(FORM_ENDPOINTS.forms, completeFormData);
      return response.data.data;
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
      const response = await api.put(FORM_ENDPOINTS.form(id), formData);
      return response.data.data;
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
      await api.delete(FORM_ENDPOINTS.form(id));
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
      const response = await api.put(FORM_ENDPOINTS.publish(id));
      return response.data.data;
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
      const response = await api.put(FORM_ENDPOINTS.archive(id));
      return response.data.data;
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
      
      // For file uploads, we need to set the content type to multipart/form-data
      const response = await axios.post(FORM_ENDPOINTS.upload(id), formData, {
        headers: {
          // Don't set Content-Type as axios will set it automatically with boundary for FormData
          ...(authService.isAuthenticated() ? { 
            Authorization: `Bearer ${authService.getToken()}` 
          } : {})
        }
      });
      
      return response.data.data;
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
      const response = await api.get(RESPONSE_ENDPOINTS.formResponses(formId));
      return response.data.data;
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
      const response = await api.get(RESPONSE_ENDPOINTS.response(id));
      return response.data.data;
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
      await api.delete(RESPONSE_ENDPOINTS.response(id));
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
      
      // Create a copy of answers that doesn't include the "file" flag
      const cleanAnswers = responseData.answers.map((answer: any) => {
        const { file, ...rest } = answer;
        return rest;
      });
      
      // Add response data as JSON string
      formData.append('answers', JSON.stringify(cleanAnswers));
      
      if (responseData.visitId) formData.append('visitId', responseData.visitId);
      if (responseData.isComplete !== undefined) formData.append('isComplete', String(responseData.isComplete));
      
      // Add files with field IDs as keys
      files.forEach((file) => {
        // Find the corresponding answer to get the fieldId
        const fileAnswer = responseData.answers.find((a: any) => a.value === file.name && a.file === true);
        if (fileAnswer) {
          formData.append(fileAnswer.fieldId, file);
        } else {
          // Fallback if we can't match the file to an answer
          formData.append('files', file);
        }
      });
      
      response = await axios.post(RESPONSE_ENDPOINTS.formResponses(formId), formData, {
        headers: {
          // Don't set Content-Type as axios will set it automatically with boundary
          ...(authService.isAuthenticated() ? { 
            Authorization: `Bearer ${authService.getToken()}` 
          } : {})
        }
      });
    } else {
      // If no files, use JSON
      response = await api.post(RESPONSE_ENDPOINTS.formResponses(formId), responseData);
    }
    
    return response.data.data;
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
      const response = await api.get(ANALYTICS_ENDPOINTS.formAnalytics(formId));
      return response.data.data;
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
      const response = await api.get(ANALYTICS_ENDPOINTS.fieldAnalytics(formId));
      return response.data.data;
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
      const response = await api.get(ANALYTICS_ENDPOINTS.visitAnalytics(formId));
      return response.data.data;
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
  exportResponses: async (formId: string, options: { format?: 'json' | 'csv', includeIncomplete?: boolean } = {}) => {
  try {
    const { format = 'csv', includeIncomplete = true } = options;
    const url = `${ANALYTICS_ENDPOINTS.exportResponses(formId)}?format=${format}&includeIncomplete=${includeIncomplete}`;
    
    // Always request as blob for CSV format
    if (format === 'csv') {
      const response = await api.get(url, { 
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv'
        }
      });
      return new Blob([response.data], { type: 'text/csv' });
    } else {
      const response = await api.get(url);
      return response.data;
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
      const response = await api.get(`/api/v1/users`);
      return response.data.data;
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
      const response = await api.get(`/api/v1/users/${id}`);
      return response.data.data;
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
      const response = await api.post(`/api/v1/users`, userData);
      return response.data.data;
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
      const response = await api.put(`/api/v1/users/${id}`, userData);
      return response.data.data;
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
      await api.delete(`/api/v1/users/${id}`);
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