"use client";

import Link from 'next/link';
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
};
