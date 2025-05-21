import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
}

export const formatSessionTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "00m 00s";
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
};

// Format date for chart display
export const formatChartDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short' 
  });
};

// Generate time periods for filtering
export const getTimePeriods = () => {
  const now = new Date();
  
  // Go back 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  // Go back 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Go back 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);
  
  // Go back 1 year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  return {
    "7days": {
      start: sevenDaysAgo,
      end: now,
      label: "Last 7 Days"
    },
    "30days": {
      start: thirtyDaysAgo,
      end: now,
      label: "Last 30 Days"
    },
    "90days": {
      start: ninetyDaysAgo,
      end: now,
      label: "Last 90 Days"
    },
    "year": {
      start: oneYearAgo,
      end: now,
      label: "Last Year"
    }
  };
};

// Filter data by selected time period
export const filterDataByTimeframe = (data: any[], timeframe: string, dateKey: string = 'date') => {
  if (!data || data.length === 0) return [];
  
  const periods = getTimePeriods();
  const selectedPeriod = periods[timeframe as keyof typeof periods];
  
  if (!selectedPeriod) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item[dateKey]);
    return itemDate >= selectedPeriod.start && itemDate <= selectedPeriod.end;
  });
};