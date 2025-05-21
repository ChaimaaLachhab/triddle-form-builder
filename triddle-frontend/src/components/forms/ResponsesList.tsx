"use client";

import * as React from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Response } from "@/types/api-types";
import { responseService } from "@/lib/api-service";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ResponsesTableProps {
  responses: Response[];
  refetchResponses: () => Promise<any>;
  searchQuery: string;
}

export function ResponsesList({
  responses,
  refetchResponses,
  searchQuery,
}: ResponsesTableProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedResponse, setSelectedResponse] =
    React.useState<Response | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Get field names from the first response to use as columns
  const getResponseFields = () => {
    if (!responses.length) return [];

    // Extract all unique field IDs from responses
    const fieldIds = new Set<string>();
    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        fieldIds.add(answer.fieldId);
      });
    });

    return Array.from(fieldIds);
  };

  const fieldIds = getResponseFields();

  // Get value for a specific field in a response
  const getFieldValue = (response: Response, fieldId: string) => {
    const answer = response.answers.find((a) => a.fieldId === fieldId);
    if (!answer) return "";

    if (Array.isArray(answer.value)) {
      return answer.value.join(", ");
    }

    return String(answer.value);
  };

  const openDeleteDialog = (response: Response) => {
    setSelectedResponse(response);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResponse) return;

    try {
      await responseService.deleteResponse(selectedResponse.id);
      toast.success("Response deleted successfully");
      setIsDialogOpen(false);
      setSelectedResponse(null);
      // Make sure to call refetchResponses after successful deletion
      await refetchResponses();
    } catch (err) {
      console.error("Error deleting response:", err);
      toast.error("Failed to delete response");
    }
  };

  const filteredResponses = React.useMemo(() => {
    if (!searchQuery) return responses;

    return responses.filter((response) => {
      return response.answers.some((answer) => {
        const value = String(answer.value);
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [responses, searchQuery]);

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
              {fieldIds.map((fieldId) => (
                <TableHead key={fieldId}>{fieldId}</TableHead>
              ))}
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResponses.length > 0 ? (
              paginatedResponses.map((response) => (
                <TableRow key={response.id}>
                  {fieldIds.map((fieldId) => (
                    <TableCell key={fieldId}>
                      {getFieldValue(response, fieldId)}
                    </TableCell>
                  ))}
                  <TableCell>
                    {response.createdAt
                      ? formatDistanceToNow(new Date(response.createdAt), {
                          addSuffix: true,
                        })
                      : "a while ago"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(response)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={fieldIds.length + 2}
                  className="h-24 text-center"
                >
                  {searchQuery
                    ? "No matching responses found"
                    : "No responses yet"}
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
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this response?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The response will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}