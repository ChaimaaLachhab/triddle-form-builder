"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartData } from "@/types/api-types";
import { filterDataByTimeframe, getTimePeriods } from "@/lib/utils";

interface ResponsesChartProps {
  data: ChartData[];
}

export function ResponsesChart({ data }: ResponsesChartProps) {
  const [timeframe, setTimeframe] = React.useState("7days");
  const periods = getTimePeriods();
  
  // Filter data based on selected timeframe
  const filteredData = React.useMemo(() => {
    return filterDataByTimeframe(data, timeframe);
  }, [data, timeframe]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Responses</h3>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(periods).map(([key, period]) => (
              <SelectItem key={key} value={key}>{period.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-64">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="responses" fill="#007AD3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available for the selected timeframe
          </div>
        )}
      </div>
    </div>
  );
}