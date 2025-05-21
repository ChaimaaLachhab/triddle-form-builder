
// User type
export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Form Field type
export interface FormField {
  fieldId: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  validations?: Record<string, any>;
  fileSettings?: FileSettings;
  order: number;
}

export interface FileSettings {
  acceptedTypes?: string;
  maxSize?: number;
  allowMultiple?: boolean;
  showPreview?: boolean;
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
  file?: boolean;
  fileUrl?: string;

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


// Analytics Interfaces

// Form Analytics Response
export interface FormAnalytics {
  totalVisits: number;
  totalResponses: number;
  conversionRate: number;
  avgCompletionTime: number;
  devices: {
    device: string;
    count: number;
  }[];
  dropOffs: any[]; // This could be more specific based on actual data structure
  dailyTrend: {
    date: string;
    count: number;
  }[];
}

// Field Analytics Response
export interface FieldAnalytics {
  fieldId: string;
  label: string;
  type: string;
  responseCount: number;
  values: any[];
  optionCounts?: {
    [key: string]: number;
  };
}

// Visit Analytics Response
export interface VisitAnalytics {
  referrers: {
    referrer: string;
    count: number;
  }[];
  browsers: {
    browser: string;
    count: number;
  }[];
  operatingSystems: {
    os: string;
    count: number;
  }[];
  hourlyDistribution: {
    hour: number;
    count: number;
  }[];
  dayOfWeekDistribution: {
    dayOfWeek: number;
    count: number;
  }[];
}

// Interface for the export options
export interface ExportOptions {
  format?: 'json' | 'csv';
  includeIncomplete?: boolean;
}

// Chart data interfaces for component props
export interface ChartData {
  date: string;
  responses: number;
}

export interface DeviceData {
  name: string;
  value: number;
}

export interface TopForm {
  id: string;
  name: string;
  responses: number;
}

export interface AnalyticsCardsProps {
  totalViews: number;
  totalSubmissions: number;
  uniqueVisitors: number;
  avgSessionTime: string;
}

export interface ResponsesChartProps {
  data: ChartData[];
}

export interface DeviceChartProps {
  data: DeviceData[];
}

export interface TopFormsTableProps {
  forms: TopForm[];
}