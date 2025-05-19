"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { AnalyticsCards } from "@/components/analytics/AnalyticsCards";
import { ResponsesChart } from "@/components/analytics/ResponsesChart";
import { TopFormsTable } from "@/components/analytics/TopFormsTable";
import { DeviceChart } from "@/components/analytics/DeviceChart";

// Mock data for demonstration
const mockChartData = [
  { date: "01 Apr", responses: 210 },
  { date: "02 Apr", responses: 130 },
  { date: "03 Apr", responses: 240 },
  { date: "04 Apr", responses: 170 },
  { date: "05 Apr", responses: 190 },
  { date: "06 Apr", responses: 90 },
  { date: "07 Apr", responses: 210 }
];

const mockTopForms = [
  { id: "1", name: "PolyPurple email subscription", responses: 218 },
  { id: "2", name: "PolyPurple Contact Form", responses: 201 },
  { id: "3", name: "Hashtag Ocean Signups", responses: 140 },
  { id: "4", name: "PolyPurple Enquiry Form", responses: 129 },
  { id: "5", name: "FormsOcean email subscription", responses: 84 }
];

const mockDeviceData = [
  { name: "Desktop", value: 91 },
  { name: "Mobile", value: 9 }
];

export default function AnalyticsPage() {
  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download Data
          </Button>
        </div>
        
        <div className="space-y-8">
          <AnalyticsCards
            totalViews={587}
            totalSubmissions={475}
            uniqueVisitors={385}
            avgSessionTime="01m 22sec"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsesChart data={mockChartData} />
            <DeviceChart data={mockDeviceData} />
            <div className="col-span-1 lg:col-span-2">
              <TopFormsTable forms={mockTopForms} />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
