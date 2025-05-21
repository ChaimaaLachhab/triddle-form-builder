"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Grid2x2, List as ListIcon, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/types/api-types";
import { FormsList } from "@/components/dashboard/FormsList";
import { FormsCard } from "@/components/dashboard/FormsCard";
import EmptyState from "@/components/dashboard/EmptyState";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useAuth } from "@/context/AuthContext";
import { formService } from "@/lib/api-service";

export default function Dashboard() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await formService.getAllForms();
        setForms(data);
      } catch (err) {
        setError("Failed to load forms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const userName = user?.name || "Guest";
  const formsCount = forms.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarLayout>
        <main className="flex-1 p-5">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <Link href="/forms/new">
              <Button className="flex items-center gap-2">
                <PlusCircle size={18} /> Create New Form
              </Button>
            </Link>
          </div>

          <div className="mb-6 flex justify-end">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid2x2 size={18} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <ListIcon size={18} />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-screen bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-center">Error</h2>
              <p className="text-gray-600 text-center">{error}</p>
            </div>
          ) : forms.length === 0 ? (
            <EmptyState />
          ) : viewMode === "list" ? (
            <FormsList forms={forms} />
          ) : (
            <FormsCard forms={forms} />
          )}
        </main>
      </SidebarLayout>
    </div>
  );
}
