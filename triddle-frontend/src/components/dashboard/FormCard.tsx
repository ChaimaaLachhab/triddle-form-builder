"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface FormProps {
  id: string;
  title: string;
  responses: number;
  lastUpdated: string;
  todayResponses: number;
}

interface FormCardProps {
  form: FormProps;
}

export default function FormCard({ form }: FormCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-base truncate">{form.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center mb-2">
          <CircleDot className="w-4 h-4 text-green-500 mr-2" />
          <div className="text-sm">
            <span className="font-medium">{form.responses} responses</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{form.todayResponses} today</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          You edited {form.lastUpdated}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={`/forms/${form.id}`} className="w-full">
          <Button variant="outline" className="w-full text-primary justify-between">
            View More
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}