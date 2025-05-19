"use client";

import * as React from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Response } from "@/types/api-types";

interface ResponsesTableProps {
  responses: Response[];
}

export function ResponsesList({ responses }: ResponsesTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  
  // Get field names from the first response to use as columns
  const getResponseFields = () => {
    if (!responses.length) return [];
    
    // Extract all unique field IDs from responses
    const fieldIds = new Set<string>();
    responses.forEach(response => {
      response.answers.forEach(answer => {
        fieldIds.add(answer.fieldId);
      });
    });
    
    return Array.from(fieldIds);
  };
  
  const fieldIds = getResponseFields();
  
  // Get value for a specific field in a response
  const getFieldValue = (response: Response, fieldId: string) => {
    const answer = response.answers.find(a => a.fieldId === fieldId);
    if (!answer) return "";
    
    if (Array.isArray(answer.value)) {
      return answer.value.join(", ");
    }
    
    return String(answer.value);
  };

  const filteredResponses = React.useMemo(() => {
    if (!searchQuery) return responses;
    
    return responses.filter(response => {
      return response.answers.some(answer => {
        const value = String(answer.value);
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [responses, searchQuery]);
  
  const paginatedResponses = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResponses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredResponses, currentPage]);
  
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {fieldIds.map(fieldId => (
                <TableHead key={fieldId}>{fieldId}</TableHead>
              ))}
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResponses.length > 0 ? (
              paginatedResponses.map((response) => (
                <TableRow key={response.id}>
                  {fieldIds.map(fieldId => (
                    <TableCell key={fieldId}>{getFieldValue(response, fieldId)}</TableCell>
                  ))}
                  <TableCell>{new Date(response.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={fieldIds.length + 1} className="h-24 text-center">
                  {searchQuery ? "No matching responses found" : "No responses yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
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