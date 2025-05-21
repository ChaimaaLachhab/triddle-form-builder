"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/types/api-types";
import { formatDistanceToNow } from "date-fns";

interface FormsListProps {
  forms: Form[];
}

export function FormsList({ forms }: FormsListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const filteredForms = React.useMemo(() => {
    if (!searchQuery) return forms;

    return forms.filter((form) =>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedForms.length > 0 ? (
              paginatedForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{form.title}</TableCell>
                  <TableCell>
                    {form.updatedAt
                      ? formatDistanceToNow(new Date(form.updatedAt), {
                          addSuffix: true,
                        })
                      : "a while ago"}
                    .
                  </TableCell>
                  <TableCell>{form.responses || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      asChild
                    >
                      <Link
                        href={`/forms/${form.id}`}
                        className="w-full"
                      >
                        View Form
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {searchQuery ? "No matching forms found" : "No forms yet"}
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
