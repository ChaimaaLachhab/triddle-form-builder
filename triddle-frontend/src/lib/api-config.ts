
// API base URL - replace with your actual API URL
 export const API_BASE_URL = "https://triddle-form-builder-bk.vercel.app";

// export const API_BASE_URL = "http://localhost:5000";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  signup: `${API_BASE_URL}/api/v1/auth/register`,
  login: `${API_BASE_URL}/api/v1/auth/login`,
  logout: `${API_BASE_URL}/api/v1/auth/logout`,
  me: `${API_BASE_URL}/api/v1/auth/me`,
  updateDetails: `${API_BASE_URL}/api/v1/auth/updatedetails`,
  updatePassword: `${API_BASE_URL}/api/v1/auth/updatepassword`,
  forgotPassword: `${API_BASE_URL}/api/v1/auth/forgotpassword`,
  resetPassword: (token: string) => `${API_BASE_URL}/api/v1/auth/resetpassword/${token}`,
};

// Form endpoints
export const FORM_ENDPOINTS = {
  forms: `${API_BASE_URL}/api/v1/forms`,
  form: (id: string) => `${API_BASE_URL}/api/v1/forms/${id}`,
  publish: (id: string) => `${API_BASE_URL}/api/v1/forms/${id}/publish`,
  archive: (id: string) => `${API_BASE_URL}/api/v1/forms/${id}/archive`,
  upload: (id: string) => `${API_BASE_URL}/api/v1/forms/${id}/upload`,
};

// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
  formAnalytics: (formId: string) => `${API_BASE_URL}/api/v1/forms/${formId}/analytics`,
  fieldAnalytics: (formId: string) => `${API_BASE_URL}/api/v1/forms/${formId}/analytics/fields`,
  visitAnalytics: (formId: string) => `${API_BASE_URL}/api/v1/forms/${formId}/analytics/visits`,
  exportResponses: (formId: string) => `${API_BASE_URL}/api/v1/forms/${formId}/export`,
};

// Responses endpoints
export const RESPONSE_ENDPOINTS = {
  formResponses: (formId: string) => `${API_BASE_URL}/api/v1/forms/${formId}/responses`,
  response: (id: string) => `${API_BASE_URL}/api/v1/responses/${id}`,
};
