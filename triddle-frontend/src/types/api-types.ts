
// User type
export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Form type
export interface Form {
  _id: string;
  title: string;
  description: string;
  fields: FormField[];
  logicJumps: LogicJump[];
  settings: FormSettings;
  status: "draft" | "published" | "archived";
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form Field type
export interface FormField {
  fieldId: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  validations?: Record<string, any>;
  fileSettings?: Record<string, any>;
  order: number;
}

// Logic Jump type
export interface LogicJump {
  fieldId: string;
  condition: string;
  value: string | number | boolean;
  destination: string;
}

// Form Settings type
export interface FormSettings {
  backgroundColor?: string;
  fontFamily?: string;
  showLabels?: boolean;
  submitButtonText?: string;
  successMessage?: string;
  redirectUrl?: string;
}

// Response type
export interface Response {
  _id: string;
  form: string;
  answers: Answer[];
  metadata: ResponseMetadata;
  createdAt: Date;
}

// Answer type
export interface Answer {
  fieldId: string;
  value: string | number | boolean | string[];
}

// Response Metadata type
export interface ResponseMetadata {
  browser?: string;
  os?: string;
  device?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
