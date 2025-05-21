"use client";

import * as React from "react";
import { Eye, Send, Users, Clock } from "lucide-react";
import { AnalyticsCardsProps } from "@/types/api-types";

export function AnalyticsCards({
  totalViews,
  totalSubmissions,
  uniqueVisitors,
  avgSessionTime
}: AnalyticsCardsProps) {
  const cards = [
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Total Submissions",
      value: totalSubmissions,
      icon: Send,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Unique Visitors",
      value: uniqueVisitors,
      icon: Users,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Avg. Session Time",
      value: avgSessionTime,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      isTime: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">
                {card.isTime ? card.value : card.value.toLocaleString()}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}