import * as React from "react";

interface FormDesignEditorProps {
  formId?: string;
  isNew?: boolean;
}

export function FormDesignEditor({ formId, isNew = false }: FormDesignEditorProps) {
  const [formTitle, setFormTitle] = React.useState(isNew ? "New Form" : "Poly Purple Contact Form");
  const [backgroundColor, setBackgroundColor] = React.useState("#FFFFFF");
  const [fontFamily, setFontFamily] = React.useState("Inter");
  const [showLabels, setShowLabels] = React.useState(true);
  const [formFields, setFormFields] = React.useState([
    { id: "1", type: "text", label: "Full Name", placeholder: "John Doe" },
    { id: "2", type: "email", label: "Email", placeholder: "john.d@website.com" },
    { id: "3", type: "textarea", label: "Message", placeholder: "Enter your message" },
  ]);
  const [formLink, setFormLink] = React.useState("formsocean.com/Qe1rtg3");
  const [embedCode, setEmbedCode] = React.useState('<iframe height="300px" width="100%" src="new.html" name="iframe_a">');

  const handleAddField = () => {
    const newField = {
      id: `${formFields.length + 1}`,
      type: "text",
      label: `Field ${formFields.length + 1}`,
      placeholder: `Enter value for field ${formFields.length + 1}`,
    };
    setFormFields([...formFields, newField]);
  };

  return (
    <div className="flex gap-6">
      {/* Left side - Form preview */}
      <div className="bg-white rounded-md shadow p-6 flex-1">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="text-xl font-semibold mb-6 w-full border-b border-transparent focus:border-blue-500 focus:outline-none"
        />

        {formFields.map((field) => (
          <div key={field.id} className="mb-6">
            {showLabels && (
              <label className="block text-sm font-medium mb-2">{field.label}</label>
            )}
            {field.type === "textarea" ? (
              <div className="relative">
                <textarea
                  placeholder={field.placeholder}
                  className="w-full p-3 border rounded-md"
                  rows={4}
                ></textarea>
                <button className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full p-3 border rounded-md"
                />
                <button className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}

        <button className="w-full py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 mb-6">
          Submit
        </button>

        <button
          onClick={handleAddField}
          className="w-full py-3 border border-dashed border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Field
        </button>
      </div>

      {/* Right side - Form settings */}
      <div className="w-80">
        <div className="bg-white rounded-md shadow p-4 mb-4">
          <h3 className="font-medium mb-4">Background Color</h3>
          <div className="flex gap-2 mb-2">
            {["#FFFFFF", "#4ADE80", "#FDE047", "#93C5FD", "#F472B6", "#000000"].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${
                  backgroundColor === color ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setBackgroundColor(color)}
              ></button>
            ))}
          </div>
          
          <h3 className="font-medium mb-4 mt-6">Font Family</h3>
          <div className="relative">
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded-md appearance-none pr-10"
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          
          <h3 className="font-medium mb-4 mt-6">Form Labels</h3>
          <div className="flex items-center">
            <div
              className={`w-10 h-6 rounded-full p-1 ${
                showLabels ? "bg-green-500" : "bg-gray-300"
              }`}
              onClick={() => setShowLabels(!showLabels)}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                  showLabels ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="ml-2">{showLabels ? "Turned ON" : "Turned OFF"}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow p-4">
          <h3 className="font-medium mb-4">Sharable Form Link</h3>
          <div className="relative">
            <input
              type="text"
              value={formLink}
              readOnly
              className="w-full p-2 border rounded-md pr-10"
            />
            <button className="absolute right-2 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          
          <h3 className="font-medium mb-4 mt-6">HTML Embed Code</h3>
          <div className="relative">
            <textarea
              value={embedCode}
              readOnly
              className="w-full p-2 border rounded-md pr-10"
              rows={3}
            ></textarea>
            <button className="absolute right-2 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
