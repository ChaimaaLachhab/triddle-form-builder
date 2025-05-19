
// User type
export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// // Form type
// export interface Form {
//   id: string;
//   title: string;
//   description: string;
//   fields: FormField[];
//   logicJumps: LogicJump[];
//   settings: FormSettings;
//   status: "draft" | "published" | "archived";
//   slug: string;
//   createdAt: Date;
//   updatedAt: Date;
//   responses: number;
//   todayResponses: number;
//   lastUpdated: Date;
// }

// // Form Field type
// export interface FormField {
//   fieldId: string;
//   type: string;
//   label: string;
//   placeholder: string;
//   required: boolean;
//   options?: string[];
//   validations?: Record<string, any>;
//   fileSettings?: Record<string, any>;
//   order: number;
// }

// // Logic Jump type
// export interface LogicJump {
//   fieldId: string;
//   condition: string;
//   value: string | number | boolean;
//   destination: string;
// }

// // Form Settings type
// export interface FormSettings {
//   backgroundColor?: string;
//   fontFamily?: string;
//   showLabels?: boolean;
//   submitButtonText?: string;
//   successMessage?: string;
//   redirectUrl?: string;
// }

// Form Field type
export interface FormField {
  fieldId: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  validations?: Record<string, any>;
  fileSettings?: Record<string, any>;
  order: number;
}

// Field Option type
export interface FieldOption {
  label: string;
  value: string;
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
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  progressBar: {
    show: boolean;
    type: string;
  };
  submitButton: {
    text: string;
  };
  successMessage: string;
}

// Form type
export interface Form {
  id?: string;
  title: string;
  description: string;
  fields: FormField[];
  logicJumps?: LogicJump[];
  settings: FormSettings;
  status?: string;
  slug?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string | null;
  responses?: number;
  responsesToday?: number;
  public_url?: string;
}

// Response type
export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  metadata: ResponseMetadata;
  responseId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Answer type
export interface Answer {
  fieldId: string;
  value: string | number | boolean | string[];
}

// Response Metadata type
export interface ResponseMetadata {
  visitId?: string;
  ipAddress?: string;
  startedAt?: Date;
  timeSpent?: number;
  userAgent?: string;
  isComplete?: boolean;
  completedAt?: Date;
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
