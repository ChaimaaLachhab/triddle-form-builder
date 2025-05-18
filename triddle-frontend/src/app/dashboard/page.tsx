"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Grid2x2, 
  List as ListIcon, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormCard from "@/components/dashboard/FormCard";
import FormListItem from "@/components/dashboard/FormsList";
import EmptyState from "@/components/dashboard/EmptyState";
import SidebarLayout from "@/components/layout/SidebarLayout";

// Mock data for demonstration
const mockForms = [
  {
    id: '1',
    title: 'Poly Purple Contact Form',
    responses: 532,
    lastUpdated: '2 days ago',
    todayResponses: 8
  },
  {
    id: '2',
    title: 'Poly Purple Email Subscription',
    responses: 2145,
    lastUpdated: '4 days ago',
    todayResponses: 8
  },
  {
    id: '3',
    title: 'Poly Purple Feedback Form',
    responses: 767,
    lastUpdated: '5 days ago',
    todayResponses: 8
  },
  {
    id: '4',
    title: 'Code Arena Contact Form',
    responses: 65,
    lastUpdated: '5 days ago',
    todayResponses: 8
  },
  {
    id: '5',
    title: 'Beach Day Event Registration',
    responses: 34,
    lastUpdated: '8 days ago',
    todayResponses: 8
  },
  {
    id: '6',
    title: 'Fun Friday Registration Form',
    responses: 232,
    lastUpdated: '12 days ago',
    todayResponses: 8
  },
  {
    id: '7',
    title: 'Employee Exit Survey Form',
    responses: 977,
    lastUpdated: '25 days ago',
    todayResponses: 8
  },
  {
    id: '8',
    title: '25th March 2023 - Seminar Survey Form',
    responses: 96,
    lastUpdated: '1 month ago',
    todayResponses: 8
  }
];

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const userName = "Subash"; // This would come from user context in a real app
  const formsCount = mockForms.length;
  
  const filteredForms = mockForms.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarLayout>
      
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Good Morning, {userName}</h1>
          <Link href="/forms/new">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} /> Create New Form
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">My Forms ({formsCount})</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-64 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid2x2 size={18} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode('list')}
              >
                <ListIcon size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        {filteredForms.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-md border shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Form Name</th>
                  <th className="text-left p-4">Last Updated</th>
                  <th className="text-left p-4">Responses</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedForms.map((form) => (
                  <FormListItem key={form.id} form={form} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedForms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredForms.length > 0 && (
          <div className="flex justify-between items-center mt-6 text-sm">
            <div className="text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredForms.length)} of {filteredForms.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              
              <span className="px-3 py-2 border rounded-md min-w-[40px] text-center">
                {currentPage}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </main>
      </SidebarLayout>
    </div>
    
  );
}