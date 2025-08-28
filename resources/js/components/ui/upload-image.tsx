import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadImageProps {
  id: string;
  label: string;
  value?: File | null;
  currentImage?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  previewClassName?: string;
  className?: string;
  maxSize?: number; // in MB
  required?: boolean;
}

export default function UploadImage({
  id,
  label,
  value,
  currentImage,
  onChange,
  error,
  accept = "image/*",
  previewClassName = "max-w-xs h-20 object-cover rounded-md border",
  className = "",
  maxSize = 5, // 5MB default
  required = false,
}: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  /**
   * Handle file selection and validation
   */
  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    onChange(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange, maxSize]);

  /**
   * Handle input change
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  }, [handleFileChange]);

  /**
   * Handle drag and drop
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  /**
   * Remove selected image
   */
  const handleRemove = useCallback(() => {
    onChange(null);
    setPreview(null);
    // Reset file input
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, [onChange, id]);

  /**
   * Set initial preview from currentImage
   */
  useEffect(() => {
    if (value) {
      // Don't override preview if new file is selected
      return;
    } else if (currentImage) {
      setPreview(currentImage);
    } else {
      setPreview(null);
    }
  }, [currentImage, value]);

  const hasPreview = preview || (value && preview);
  const fileName = value?.name;

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className={required ? "required" : ""}>
        {label}
      </Label>
      
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-300"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {hasPreview ? (
          <div className="relative">
            <img
              src={preview!}
              alt={`${label} preview`}
              className={`mx-auto ${previewClassName}`}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
            <p className="text-sm text-gray-600 text-center mt-2">
              {fileName ? `New: ${fileName}` : 'Current image'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor={id} className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
        
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required}
        />
      </div>

      <InputError message={error} />
      
      {fileName && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          New file selected: {fileName}
        </p>
      )}
    </div>
  );
}