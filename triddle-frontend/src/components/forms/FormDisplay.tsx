import * as React from "react";
import { Form, FormField, Answer } from "@/types/api-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FormDisplayProps {
  form: Form;
  isPreview?: boolean;
  onSubmit?: (answers: Answer[]) => Promise<void>;
  isSubmitting?: boolean;
}

export function FormDisplay({
  form,
  isPreview = false,
  onSubmit,
  isSubmitting = false,
}: FormDisplayProps) {
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Handle field value changes
  const handleChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPreview) {
      toast.info("This is just a preview. Form submissions are disabled.");
      return;
    }
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    form.fields.forEach((field) => {
      if (field.required && (!answers[field.fieldId] || 
         (Array.isArray(answers[field.fieldId]) && answers[field.fieldId].length === 0))) {
        newErrors[field.fieldId] = "This field is required";
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Format answers for submission
    const formattedAnswers: Answer[] = Object.entries(answers).map(([fieldId, value]) => ({
      fieldId,
      value,
    }));
    
    // Submit form if onSubmit handler is provided
    if (onSubmit) {
      onSubmit(formattedAnswers);
    }
  };

  // Render a field based on its type
  const renderField = (field: FormField) => {
    const value = answers[field.fieldId] || "";
    const hasError = !!errors[field.fieldId];
    
    switch (field.type) {
      case "text":
        return (
          <div key={field.fieldId} className="mb-6">
            <Label className="mb-2 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type="text"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              disabled={isPreview || isSubmitting}
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.fieldId} className="mb-6">
            <Label className="mb-2 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              disabled={isPreview || isSubmitting}
              className={hasError ? "border-red-500" : ""}
              rows={5}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.fieldId} className="mb-6">
            <Label className="mb-2 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => {
                // Initialize as array if not already
                const selectedValues = Array.isArray(value) ? value : [];
                const isChecked = selectedValues.includes(option.value);
                
                return (
                  <div key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`${field.fieldId}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const newValues = isChecked
                          ? selectedValues.filter((v) => v !== option.value)
                          : [...selectedValues, option.value];
                        handleChange(field.fieldId, newValues);
                      }}
                      disabled={isPreview || isSubmitting}
                    />
                    <label
                      htmlFor={`${field.fieldId}-${option.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div key={field.fieldId} className="mb-6">
            <Label className="mb-2 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleChange(field.fieldId, val)}
              disabled={isPreview || isSubmitting}
            >
              <SelectTrigger className={hasError ? "border-red-500" : ""}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.fieldId} className="mb-6">
            <Label className="mb-2 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type="date"
              value={value}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              disabled={isPreview || isSubmitting}
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={field.fieldId} className="mb-6">
            <Label className="mb-2 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleChange(field.fieldId, e.target.files[0]);
                    }
                  }}
                  disabled={isPreview || isSubmitting}
                />
              </label>
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Sort fields by their order
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="p-8" style={{ fontFamily: form.settings?.theme?.fontFamily || 'Inter, sans-serif' }}>
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      {form.description && (
        <p className="text-gray-600 mb-6">{form.description}</p>
      )}

      <form onSubmit={handleSubmit}>
        {sortedFields.map(renderField)}

        <Button
          type="submit"
          className="mt-4"
          disabled={isPreview || isSubmitting}
          style={{ 
            backgroundColor: isPreview ? '#ccc' : (form.settings?.theme?.primaryColor || '#4F46E5')
          }}
        >
          {isSubmitting 
            ? "Submitting..." 
            : (isPreview 
              ? "Preview Mode" 
              : (form.settings?.submitButton?.text || "Submit")
            )
          }
        </Button>
      </form>
    </div>
  );
}