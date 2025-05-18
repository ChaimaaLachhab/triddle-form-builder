
"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center bg-white">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">You haven't created any forms yet.</h3>
        <p className="text-gray-500">Get started by creating your first form!</p>
      </div>
      <Link href="/forms/new">
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} /> Create New Form
        </Button>
      </Link>
    </div>
  );
}