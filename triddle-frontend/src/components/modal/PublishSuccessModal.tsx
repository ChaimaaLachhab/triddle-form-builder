import * as React from "react";
import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PublishSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl?: string;
}

const PublishSuccessModal = ({
  isOpen,
  onClose,
  publicUrl = "",
}: PublishSuccessProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader className="space-y-2">
          <div className="flex flex-col items-center space-x-2">
            <FileText className="w-9 h-9 text-blue-600" />
            <DialogTitle className="text-lg font-semibold">
              Form Published Successfully
            </DialogTitle>
          </div>
          <DialogDescription>
            Your form is now live and can be shared with others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Sharable Form Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm truncate"
              />
              <Button
                type="button"
                onClick={handleCopy}
                variant="outline"
                className="text-sm"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check size={16} /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy size={16} /> Copy
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishSuccessModal;
