"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { AnalyticsCards } from "@/components/analytics/AnalyticsCards";
import { ResponsesChart } from "@/components/analytics/ResponsesChart";
import { TopFormsTable } from "@/components/analytics/TopFormsTable";
import { DeviceChart } from "@/components/analytics/DeviceChart";
import { useRouter } from "next/navigation";
import { analyticsService, formService } from "@/lib/api-service";
import { FormAnalytics, FieldAnalytics, VisitAnalytics, ChartData, DeviceData, TopForm, Form } from "@/types/api-types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatSessionTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function AnalyticsPage() {
  const router = useRouter();
  
  const [loading, setLoading] = React.useState(true);
  const [formsList, setFormsList] = React.useState([] as Form[]);
  const [selectedFormId, setSelectedFormId] = React.useState("");
  const [formAnalytics, setFormAnalytics] = React.useState<FormAnalytics | null>(null);
  const [fieldAnalytics, setFieldAnalytics] = React.useState<FieldAnalytics[] | null>(null);
  const [visitAnalytics, setVisitAnalytics] = React.useState<VisitAnalytics | null>(null);
  const [timeframe, setTimeframe] = React.useState("7days");
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);

  // Fetch available forms on component mount
  React.useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        // Fetch the list of forms
        const forms = await formService.getAllForms();
        setFormsList(forms);
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("Failed to load forms. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchForms();
  }, []);

  // Fetch analytics data when a form is selected
  React.useEffect(() => {
    if (!selectedFormId) return;
    
    const fetchAnalyticsData = async () => {
      setAnalyticsLoading(true);
      try {
        const [formData, fieldData, visitData] = await Promise.all([
          analyticsService.getFormAnalytics(selectedFormId),
          analyticsService.getFieldAnalytics(selectedFormId),
          analyticsService.getVisitAnalytics(selectedFormId)
        ]);
        
        setFormAnalytics(formData);
        setFieldAnalytics(fieldData);
        setVisitAnalytics(visitData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to load analytics data. Please try again.");
      } finally {
        setAnalyticsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [selectedFormId, timeframe]);

  interface HandleFormSelect {
    (formId: string): void;
  }

  const handleFormSelect: HandleFormSelect = (formId) => {
    setSelectedFormId(formId);
  };

  const handleDownloadData = async () => {
    if (!selectedFormId) {
      toast.error("Please select a form first");
      return;
    }
    
    try {
      const blob = await analyticsService.exportResponses(selectedFormId, { 
        format: 'csv', 
        includeIncomplete: true 
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-responses-${selectedFormId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Data downloaded successfully");

    } catch (error) {
      console.error("Error downloading data:", error);
      toast.error("Failed to download data");
    }
  };

  // Transform dailyTrend data for the ResponsesChart
  const chartData: ChartData[] = React.useMemo(() => {
    if (!formAnalytics?.dailyTrend) return [];
    
    return formAnalytics.dailyTrend.map((item: { date: string; count: number }) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      responses: item.count
    }));
  }, [formAnalytics?.dailyTrend]);

  // Transform device data for the DeviceChart
  const deviceData: DeviceData[] = React.useMemo(() => {
    if (!formAnalytics?.devices) return [];
    
    return formAnalytics.devices.map((item: { device: string; count: number }) => ({
      name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
      value: item.count
    }));
  }, [formAnalytics?.devices]);

  // Prepare top forms data
  const topFormsData: TopForm[] = React.useMemo(() => {
    if (!fieldAnalytics) return [];
    
    return fieldAnalytics
      .filter(field => field.responseCount > 0)
      .sort((a, b) => b.responseCount - a.responseCount)
      .slice(0, 5)
      .map(field => ({
        id: field.fieldId,
        name: field.label,
        responses: field.responseCount
      }));
  }, [fieldAnalytics]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-4 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <Skeleton className="h-8 w-40" />
          </div>
          
          <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          {selectedFormId && (
            <Button variant="outline" className="flex items-center" onClick={handleDownloadData}>
              <Download className="mr-2 h-4 w-4" />
              Download Data
            </Button>
          )}
        </div>
        
        <div className="space-y-8">
          {/* Form Selection Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Select a form to view analytics</h2>
                <Select onValueChange={handleFormSelect} value={selectedFormId}>
                  <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Select a form" />
                  </SelectTrigger>
                  <SelectContent>
                    {formsList.map(form => (
                      <SelectItem key={form.id ?? ""} value={form.id ?? ""}>
                        {form.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Display analytics when a form is selected */}
          {selectedFormId ? (
            analyticsLoading ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="col-span-1 lg:col-span-2 h-80 w-full" />
                </div>
              </div>
            ) : (
              <>
                <AnalyticsCards
                  totalViews={formAnalytics?.totalVisits || 0}
                  totalSubmissions={formAnalytics?.totalResponses || 0}
                  uniqueVisitors={visitAnalytics?.referrers.reduce((sum, item) => sum + item.count, 0) || 0}
                  avgSessionTime={formatSessionTime(formAnalytics?.avgCompletionTime || 0)}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsesChart data={chartData} />
                  <DeviceChart data={deviceData} />
                  <div className="col-span-1 lg:col-span-2">
                    <TopFormsTable forms={topFormsData} />
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Please select a form to view its analytics data
              </p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}