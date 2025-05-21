"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleDot, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form } from "@/types/api-types";
import { formatDistanceToNow } from "date-fns";

interface FormCardItemProps {
  form: Form;
}

function FormCardItem({ form }: FormCardItemProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-base truncate">{form.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center mb-2">
          <CircleDot className="w-4 h-4 text-green-500 mr-2" />
          <div className="text-sm">
            <span className="font-medium">{form.responses || 0} responses</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{form.responsesToday} today</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          You edited{" "}
          {form.updatedAt
            ? formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })
            : "a while ago"}
          .
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={`/forms/${form.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full text-primary justify-between"
          >
            View More
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface FormsCardProps {
  forms: Form[];
}

export function FormsCard({ forms }: FormsCardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;
  
  const filteredForms = React.useMemo(() => {
    if (!searchQuery) return forms;
    
    return forms.filter(form => 
      form.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [forms, searchQuery]);
  
  const paginatedForms = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredForms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredForms, currentPage]);
  
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <h2 className="text-lg font-medium">Forms ({forms.length})</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-64 pr-10"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>
      
      {paginatedForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedForms.map((form) => (
            <FormCardItem key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-white">
          <p className="text-gray-500">
            {searchQuery ? "No matching forms found" : "No forms yet"}
          </p>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}