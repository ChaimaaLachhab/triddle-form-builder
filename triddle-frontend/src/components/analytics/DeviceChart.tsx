"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#007AD3', '#FFB547'];

interface DeviceData {
  name: string;
  value: number;
}

interface DeviceChartProps {
  data: DeviceData[];
}

export function DeviceChart({ data }: DeviceChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="text-lg font-medium mb-4">Top Responses</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
