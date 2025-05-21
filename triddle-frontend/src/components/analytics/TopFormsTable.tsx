"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopForm } from "@/types/api-types";

interface TopFormsTableProps {
  forms: TopForm[];
}

export function TopFormsTable({ forms }: TopFormsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="text-lg font-medium mb-4">Top Fields by Responses</h3>
      
      {forms.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead className="text-right">Responses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.name}</TableCell>
                  <TableCell className="text-right">
                    {form.responses}
                    <Link href={`/forms/${form.id}`} className="ml-2 inline-block">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No response data available
        </div>
      )}
    </div>
  );
}