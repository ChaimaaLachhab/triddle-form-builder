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
import { Upload, X, File, FileImage, ArrowLeft, ArrowRight } from "lucide-react";
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
  const [filePreview, setFilePreview] = React.useState<Record<string, { name: string, type: string, url?: string }>>({});
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [currentFieldIndex, setCurrentFieldIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<"sequential" | "all">("sequential");
  
  // Get primary color from form settings
  const primaryColor = form.settings?.theme?.primaryColor || "#4F46E5";

  // Generate CSS variables for dynamic styling
  const cssVars = {
    "--primary-color": primaryColor,
    "--primary-color-light": `${primaryColor}33`, // Adding 33 for 20% opacity
  } as React.CSSProperties;

  // Sort fields by their order
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

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

  // Handle file uploads
  const handleFileUpload = (fieldId: string, file: File) => {
    handleChange(fieldId, file);
    
    // Create file preview
    if (file) {
      const fileType = file.type;
      const isImage = fileType.startsWith("image/");
      const isPdf = fileType === "application/pdf";
      
      if (isImage) {
        const url = URL.createObjectURL(file);
        setFilePreview(prev => ({
          ...prev,
          [fieldId]: {
            name: file.name,
            type: fileType,
            url
          }
        }));
      } else {
        setFilePreview(prev => ({
          ...prev,
          [fieldId]: {
            name: file.name,
            type: fileType
          }
        }));
      }
    }
  };
  
  // Handle file removal
  const handleRemoveFile = (fieldId: string) => {
    // Remove file from answers
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[fieldId];
      return newAnswers;
    });
    
    // Remove file preview
    setFilePreview(prev => {
      const newPreviews = { ...prev };
      
      // Revoke object URL to avoid memory leaks
      if (newPreviews[fieldId]?.url) {
        URL.revokeObjectURL(newPreviews[fieldId].url!);
      }
      
      delete newPreviews[fieldId];
      return newPreviews;
    });
  };

  // Handle field focus
  const handleFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  // Handle field blur
  const handleBlur = () => {
    setFocusedField(null);
  };

  // Navigate to previous field
  const handlePrevField = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
    }
  };

  // Navigate to next field
  const handleNextField = () => {
    const currentField = sortedFields[currentFieldIndex];
    
    // Validate current field before moving to next
    if (currentField.required && (!answers[currentField.fieldId] || 
       (Array.isArray(answers[currentField.fieldId]) && answers[currentField.fieldId].length === 0))) {
      setErrors({
        ...errors,
        [currentField.fieldId]: "This field is required"
      });
      return;
    }
    
    // Clear error if validation passes
    if (errors[currentField.fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[currentField.fieldId];
      setErrors(newErrors);
    }
    
    // Move to next field if not at the end
    if (currentFieldIndex < sortedFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  // Toggle between sequential and all fields view
  const toggleViewMode = () => {
    setViewMode(viewMode === "sequential" ? "all" : "sequential");
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPreview) {
      toast.info("This is just a preview. Form submissions are disabled.");
      return;
    }
    
    // Validate all required fields
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
      
      // If in sequential view, navigate to first field with error
      if (viewMode === "sequential") {
        const errorIndex = sortedFields.findIndex(field => newErrors[field.fieldId]);
        if (errorIndex !== -1) {
          setCurrentFieldIndex(errorIndex);
        }
      }
      
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

  // Cleanup function for file preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      // Revoke all created object URLs to prevent memory leaks
      Object.values(filePreview).forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  // Generate dynamic styles based on field state
  const getFieldStyles = (fieldId: string, hasError: boolean) => {
    const styles = {
      borderColor: hasError ? "red" : focusedField === fieldId ? primaryColor : "",
      boxShadow: focusedField === fieldId ? `0 0 0 2px ${primaryColor}33` : "",
    };
    
    return styles;
  };

  // Render a field based on its type
  const renderField = (field: FormField) => {
    const value = answers[field.fieldId] || "";
    const hasError = !!errors[field.fieldId];
    const fieldStyles = getFieldStyles(field.fieldId, hasError);
    
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
              onFocus={() => handleFocus(field.fieldId)}
              onBlur={handleBlur}
              disabled={isPreview || isSubmitting}
              className={hasError ? "border-red-500" : ""}
              style={fieldStyles}
              autoFocus={viewMode === "sequential"}
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
              onFocus={() => handleFocus(field.fieldId)}
              onBlur={handleBlur}
              disabled={isPreview || isSubmitting}
              className={hasError ? "border-red-500" : ""}
              style={fieldStyles}
              rows={5}
              autoFocus={viewMode === "sequential"}
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
                      style={{
                        borderColor: isChecked ? primaryColor : undefined,
                        backgroundColor: isChecked ? primaryColor : undefined,
                      }}
                      className="custom-checkbox"
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
            <div className="custom-select-wrapper">
              <Select
                value={value}
                onValueChange={(val) => handleChange(field.fieldId, val)}
                disabled={isPreview || isSubmitting}
              >
                <SelectTrigger 
                  className={hasError ? "border-red-500" : ""}
                  style={{
                    ...fieldStyles,
                    borderColor: focusedField === field.fieldId ? primaryColor : fieldStyles.borderColor
                  }}
                  onFocus={() => handleFocus(field.fieldId)}
                  onBlur={handleBlur}
                >
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent
                  style={{ 
                    /* Added color for selected item in dropdown */
                    "--selected-color": primaryColor
                  } as React.CSSProperties}
                >
                  {field.options?.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="custom-select-item"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              onFocus={() => handleFocus(field.fieldId)}
              onBlur={handleBlur}
              disabled={isPreview || isSubmitting}
              className={hasError ? "border-red-500" : ""}
              style={fieldStyles}
              autoFocus={viewMode === "sequential"}
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
            
            {/* Show file preview if a file has been selected */}
            {filePreview[field.fieldId] ? (
              <div className="mt-2 mb-4 p-4 border rounded-lg bg-gray-50 relative">
                <div className="flex items-center">
                  {filePreview[field.fieldId].type.startsWith("image/") && filePreview[field.fieldId].url ? (
                    <div className="mr-3">
                      <img 
                        src={filePreview[field.fieldId].url} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  ) : filePreview[field.fieldId].type === "application/pdf" ? (
                    <div className="mr-3">
                      <File className="w-12 h-12 text-red-500" />
                    </div>
                  ) : (
                    <div className="mr-3">
                      <FileImage className="w-12 h-12 text-blue-500" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm">{filePreview[field.fieldId].name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {filePreview[field.fieldId].type}
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 rounded-full"
                    onClick={() => handleRemoveFile(field.fieldId)}
                    disabled={isPreview || isSubmitting}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label 
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                    focusedField === field.fieldId ? "border-primary" : "border-gray-300"
                  }`}
                  style={{
                    borderColor: focusedField === field.fieldId ? primaryColor : hasError ? "red" : ""
                  }}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload 
                      className="w-8 h-8 mb-3 text-gray-400" 
                      style={{ color: focusedField === field.fieldId ? primaryColor : "" }}
                    />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG, PDF or GIF
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden"
                    onFocus={() => handleFocus(field.fieldId)}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(field.fieldId, e.target.files[0]);
                      }
                    }}
                    disabled={isPreview || isSubmitting}
                  />
                </label>
              </div>
            )}
            
            {hasError && (
              <p className="mt-1 text-sm text-red-500">{errors[field.fieldId]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render the progress bar
  const renderProgressBar = () => {
    const progress = ((currentFieldIndex) / sortedFields.length) * 100;
    
    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full" 
            style={{ 
              width: `${progress}%`, 
              backgroundColor: primaryColor 
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Render the navigation buttons
  const renderNavigation = () => {
    const isLastField = currentFieldIndex === sortedFields.length - 1;
    
    return (
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevField}
          disabled={currentFieldIndex === 0 || isPreview || isSubmitting}
          className="flex items-center gap-1"
          style={{
            borderColor: primaryColor,
            color: primaryColor,
            backgroundColor: focusedField === sortedFields[currentFieldIndex]?.fieldId ? `${primaryColor}22` : undefined,
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        {isLastField ? (
          <Button
            type="submit"
            disabled={isPreview || isSubmitting}
            style={{ backgroundColor: isPreview ? '#ccc' : primaryColor }}
          >
            {isSubmitting 
              ? "Submitting..." 
              : (isPreview 
                ? "Preview Mode" 
                : (form.settings?.submitButton?.text || "Submit")
              )
            }
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNextField}
            disabled={isPreview || isSubmitting}
            className="flex items-center gap-1"
            style={{ backgroundColor: primaryColor }}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div 
      className="p-8" 
      style={{ 
        ...cssVars,
        fontFamily: form.settings?.theme?.fontFamily || 'Inter, sans-serif' 
      }}
    >
      {/* Add custom CSS for elements */}
      <style jsx>{`
        .custom-checkbox[data-state="checked"] {
          background-color: var(--primary-color) !important;
          border-color: var(--primary-color) !important;
        }
        
        .custom-checkbox:focus-visible {
          outline-color: var(--primary-color) !important;
        }
        
        .custom-select-wrapper [data-state="checked"] {
          color: var(--primary-color) !important;
        }
        
        .custom-select-item[data-state="checked"] {
          background-color: var(--primary-color-light) !important;
          color: var(--primary-color) !important;
        }
        
        .custom-select-item[data-highlighted] {
          background-color: var(--primary-color-light) !important;
          color: var(--primary-color) !important;
        }
      `}</style>
      
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      {form.description && (
        <p className="text-gray-600 mb-6">{form.description}</p>
      )}

      {/* View Mode Toggle Button */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={toggleViewMode}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          disabled={isPreview || isSubmitting}
        >
          {viewMode === "sequential" ? "Show all fields" : "Show one field at a time"}
        </button>
      </div>

      {/* Progress Bar (only in sequential view) */}
      {viewMode === "sequential" && renderProgressBar()}

      <form onSubmit={handleSubmit}>
        {viewMode === "sequential" ? (
          // Sequential view - one field at a time
          sortedFields[currentFieldIndex] && renderField(sortedFields[currentFieldIndex])
        ) : (
          // All fields view
          sortedFields.map(renderField)
        )}

        {viewMode === "sequential" ? (
          // Sequential view navigation
          renderNavigation()
        ) : (
          // All fields view submit button
          <Button
            type="submit"
            className="mt-4"
            disabled={isPreview || isSubmitting}
            style={{ 
              backgroundColor: isPreview ? '#ccc' : primaryColor
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
        )}
      </form>
    </div>
  );
}