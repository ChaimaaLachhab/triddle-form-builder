"use client";

import * as React from "react";
import { 
  FileText, 
  Plus, 
  Settings, 
  Eye, 
  Save, 
  MoveVertical,
  Trash,
  Type,
  CheckSquare,
  ListFilter,
  Calendar,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Form, FormField, FieldOption } from "@/types/api-types";
import { formService } from "@/lib/api-service";
import { useRouter } from "next/navigation";

const fieldTypes = [
  { id: "text", label: "Text field", icon: Type },
  { id: "textarea", label: "Multi-line text", icon: FileText },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "dropdown", label: "Dropdown", icon: ListFilter },
  { id: "date", label: "Date picker", icon: Calendar },
  { id: "file", label: "File upload", icon: Upload },
];

interface FormBuilderProps {
  initialForm?: Form | null;
}

export function FormBuilder({ initialForm }: FormBuilderProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  
  // Initialize state with initial form data or defaults
  const [formTitle, setFormTitle] = React.useState(initialForm?.title || "Untitled Form");
  const [formDescription, setFormDescription] = React.useState(initialForm?.description || "");
  
  const [fields, setFields] = React.useState<FormField[]>(
    initialForm?.fields || []
  );
  
  const [currentFieldIndex, setCurrentFieldIndex] = React.useState<number | null>(null);
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  
  // Form settings
  const [primaryColor, setPrimaryColor] = React.useState(
    initialForm?.settings?.theme?.primaryColor || "#4F46E5"
  );
  const [backgroundColor, setBackgroundColor] = React.useState(
    initialForm?.settings?.theme?.backgroundColor || "#FFFFFF"
  );
  const [fontFamily, setFontFamily] = React.useState(
    initialForm?.settings?.theme?.fontFamily || "Inter, sans-serif"
  );
  const [showProgressBar, setShowProgressBar] = React.useState(
    initialForm?.settings?.progressBar?.show !== false
  );
  const [progressBarType, setProgressBarType] = React.useState(
    initialForm?.settings?.progressBar?.type || "bar"
  );
  const [submitButtonText, setSubmitButtonText] = React.useState(
    initialForm?.settings?.submitButton?.text || "Submit"
  );
  const [successMessage, setSuccessMessage] = React.useState(
    initialForm?.settings?.successMessage || "Thank you for your submission!"
  );
  const [showLabels, setShowLabels] = React.useState(true);
  
  const addField = (type: string) => {
    const newField: FormField = {
      fieldId: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: type === 'dropdown' || type === 'checkbox' ? [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' }
      ] : undefined,
      order: fields.length
    };
    
    setFields([...fields, newField]);
    setCurrentFieldIndex(fields.length);
    setShowFieldSelector(false);
  };
  
  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };
  
  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    
    // Update order values for all fields
    const reorderedFields = updatedFields.map((field, idx) => ({
      ...field,
      order: idx
    }));
    
    setFields(reorderedFields);
    setCurrentFieldIndex(null);
  };
  
  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= fields.length) return;
    
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    
    // Update order values
    const reorderedFields = updatedFields.map((field, idx) => ({
      ...field,
      order: idx
    }));
    
    setFields(reorderedFields);
    setCurrentFieldIndex(toIndex);
  };
  
  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    if (!field.options || field.options.length <= 1) return;
    
    const updatedOptions = [...field.options];
    updatedOptions.splice(optionIndex, 1);
    updateField(fieldIndex, { options: updatedOptions });
  };
  
  const buildFormData = (): Form => {
    return {
      title: formTitle,
      description: formDescription,
      fields: fields,
      logicJumps: initialForm?.logicJumps || [],
      settings: {
        theme: {
          primaryColor,
          backgroundColor,
          fontFamily
        },
        progressBar: {
          show: showProgressBar,
          type: progressBarType
        },
        submitButton: {
          text: submitButtonText
        },
        successMessage
      }
    };
  };
  
  const saveForm = async () => {
    try {
      setLoading(true);
      const formData = buildFormData();
      
      let savedForm: Form;
      
      if (initialForm?.id) {
        savedForm = await formService.updateForm(initialForm.id, formData);
        toast.success("Form updated successfully");
      } else {
        savedForm = await formService.createForm(formData);
        toast.success("Form created successfully");
        // Navigate to edit page with the new ID
        router.push(`/forms/${savedForm.id}`);
      }
    } catch (error) {
      toast.error("Failed to save form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const publishForm = async () => {
    try {
      setLoading(true);
      
      // First save the form if it's new
      let formId = initialForm?.id;
      
      if (!formId) {
        const formData = buildFormData();
        const savedForm = await formService.createForm(formData);
        formId = savedForm.id;
      } else {
        // Update before publishing
        const formData = buildFormData();
        await formService.updateForm(formId, formData);
      }
      
      // Now publish the form
      const publishedForm = await formService.publishForm(formId as string);
      toast.success("Form published successfully");
      
      // Navigate to the published form page
      if (publishedForm.id) {
        router.push(`/forms/${publishedForm.id}`);
      }
    } catch (error) {
      toast.error("Failed to publish form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Render the required asterisk next to the label
  const renderRequiredAsterisk = (isRequired: boolean) => {
    if (!isRequired) return null;
    return <span className="text-red-500 ml-1">*</span>;
  };
  
  // Helper function to render field previews
  function renderFieldPreview(field: FormField) {
    switch (field.type) {
      case 'text':
        return (
          <Input 
            type="text" 
            placeholder={field.placeholder} 
            disabled 
          />
        );
      case 'textarea':
        return (
          <Textarea 
            placeholder={field.placeholder}
            disabled
          />
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input type="checkbox" id={`${field.fieldId}-${i}`} disabled />
                <label htmlFor={`${field.fieldId}-${i}`}>{option.label}</label>
              </div>
            )) || (
              <div className="flex items-center space-x-2">
                <input type="checkbox" id={field.fieldId} disabled />
                <label htmlFor={field.fieldId}>{field.placeholder}</label>
              </div>
            )}
          </div>
        );
      case 'dropdown':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, i) => (
                <SelectItem key={i} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
        return <Input type="date" disabled />;
      case 'file':
        return (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
              <input type="file" className="hidden" disabled />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Form Preview Panel */}
      <div 
        className="w-full lg:w-4/5 p-2 overflow-auto"
        style={{ backgroundColor }}
      >
        <div 
          className=" mx-auto bg-white rounded-lg shadow-sm p-10"
          style={{ fontFamily }}
        >
          <input
            className="w-full text-xl font-semibold mb-2 border-0 focus:outline-none focus:ring-0"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Form Title"
          />
          
          <input
            className="w-full text-sm text-gray-500 mb-4 border-0 focus:outline-none focus:ring-0"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form Description (optional)"
          />
          
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div 
                key={field.fieldId} 
                className={`p-4 rounded-md transition-all border border-black-200 relative ${currentFieldIndex === index ? 'bg-blue-50 border border-blue-200' : ''}`}
                onClick={() => setCurrentFieldIndex(index)}
              >
                {/* Quick remove button in the top-left corner */}
                <button 
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeField(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
                
                {showLabels && (
                  <Label className="mb-2 block pt-2">
                    {field.label}
                    {renderRequiredAsterisk(field.required)}
                  </Label>
                )}
                {renderFieldPreview(field)}
              </div>
            ))}
            
            {fields.length === 0 && (
              <div className="text-center p-6 border-2 border-dashed rounded-md">
                <p className="text-gray-500">
                  Add your first field to get started
                </p>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={() => setShowFieldSelector(!showFieldSelector)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Field
              </Button>
              
              {showFieldSelector && (
                <div className="mt-2 p-4 border rounded-md bg-white shadow-sm">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {fieldTypes.map(fieldType => (
                      <Button
                        key={fieldType.id}
                        variant="outline"
                        className="flex justify-start items-center h-auto py-3"
                        onClick={() => addField(fieldType.id)}
                      >
                        <fieldType.icon className="mr-2 h-4 w-4" />
                        {fieldType.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Panel */}
      <div className="w-full lg:w-2/5 p-4 md:border-l border-t border-gray-200 overflow-auto">
        <Tabs defaultValue="field">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="field" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Field
            </TabsTrigger>
            <TabsTrigger value="form" className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Form
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="field">
            {currentFieldIndex !== null && fields[currentFieldIndex] ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="field-label">Field Label</Label>
                  <Input
                    id="field-label"
                    value={fields[currentFieldIndex].label}
                    onChange={(e) => updateField(currentFieldIndex, { label: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={fields[currentFieldIndex].placeholder}
                    onChange={(e) => updateField(currentFieldIndex, { placeholder: e.target.value })}
                  />
                </div>
                
                {(fields[currentFieldIndex].type === 'dropdown' || fields[currentFieldIndex].type === 'checkbox') && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {fields[currentFieldIndex].options?.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2 mb-2">
                        <Input
                          value={option.label}
                          onChange={(e) => {
                            const updatedOptions = [...(fields[currentFieldIndex].options || [])];
                            updatedOptions[i] = {
                              ...updatedOptions[i],
                              label: e.target.value,
                              value: e.target.value.toLowerCase().replace(/\s+/g, '-')
                            };
                            updateField(currentFieldIndex, { options: updatedOptions });
                          }}
                          placeholder="Option label"
                          className="flex-1"
                        />
                        <button
                          onClick={() => removeOption(currentFieldIndex, i)}
                          className="p-2 rounded-md hover:bg-gray-100"
                          type="button"
                          aria-label="Remove option"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOption = { label: 'New Option', value: 'new-option' };
                        const updatedOptions = [...(fields[currentFieldIndex].options || []), newOption];
                        updateField(currentFieldIndex, { options: updatedOptions });
                      }}
                    >
                      Add Option
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="required">
                    Required Field {fields[currentFieldIndex].required && <span className="text-red-500">*</span>}
                  </Label>
                  <Switch
                    id="required"
                    checked={fields[currentFieldIndex].required}
                    onCheckedChange={(checked) => updateField(currentFieldIndex, { required: checked })}
                  />
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveField(currentFieldIndex, currentFieldIndex - 1)}
                      disabled={currentFieldIndex === 0}
                      className="flex-1"
                    >
                      <MoveVertical className="h-4 w-4 mr-2" />
                      Move Up
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveField(currentFieldIndex, currentFieldIndex + 1)}
                      disabled={currentFieldIndex === fields.length - 1}
                      className="flex-1"
                    >
                      <MoveVertical className="h-4 w-4 mr-2" />
                      Move Down
                    </Button>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeField(currentFieldIndex)}
                    className="w-full"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove Field
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No Field Selected</h3>
                <p className="text-sm">Select a field to configure it or add a new field</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="form">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form-description">Form Description</Label>
                <Textarea
                  id="form-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex space-x-2">
                  {["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"].map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 ${primaryColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                      style={{ backgroundColor: color, borderColor: color === primaryColor ? '#3B82F6' : '#D1D5DB' }}
                      onClick={() => setPrimaryColor(color)}
                      aria-label={`Set primary color to ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex space-x-2">
                  {["#FFFFFF", "#F3F4F6", "#FEF3C7", "#DBEAFE", "#F3E8FF", "#F9FAFE"].map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 ${backgroundColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                      style={{ backgroundColor: color, borderColor: color === backgroundColor ? '#3B82F6' : '#D1D5DB' }}
                      onClick={() => setBackgroundColor(color)}
                      aria-label={`Set background color to ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                    <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-progress-bar">Progress Bar</Label>
                <Switch
                  id="show-progress-bar"
                  checked={showProgressBar}
                  onCheckedChange={setShowProgressBar}
                />
              </div>
              
              {showProgressBar && (
                <div className="space-y-2">
                  <Label htmlFor="progress-bar-type">Progress Bar Type</Label>
                  <Select value={progressBarType} onValueChange={setProgressBarType}>
                    <SelectTrigger id="progress-bar-type">
                      <SelectValue placeholder="Select progress bar type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="steps">Steps</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="submit-button-text">Submit Button Text</Label>
                <Input
                  id="submit-button-text"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="success-message">Success Message</Label>
                <Textarea
                  id="success-message"
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels">Form Labels</Label>
                <Switch
                  id="show-labels"
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
              </div>
              
              <div className="pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={saveForm}
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {initialForm?.id ? "Update Form" : "Save Form"}
                </Button>
                
                <Button
                  className="w-full"
                  onClick={publishForm}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Publish Form"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}