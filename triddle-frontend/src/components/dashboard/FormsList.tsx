
"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormProps {
  id: string;
  title: string;
  responses: number;
  lastUpdated: string;
}

interface FormListItemProps {
  form: FormProps;
}

export default function FormListItem({ form }: FormListItemProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">{form.title}</td>
      <td className="p-4">{form.lastUpdated}</td>
      <td className="p-4">{form.responses}</td>
      <td className="p-4">
        <Link href={`/forms/${form.id}`}>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 flex items-center space-x-1">
            <span>View More</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
      </td>
    </tr>
  );
}
