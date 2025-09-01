import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Upload, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface ImageUploadProps {
    label: string;
    value?: string | File | null;
    onChange: (file: File | null, url?: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    preview?: boolean;
    placeholder?: string;
    error?: string;
    className?: string;
    allowUrl?: boolean;
}

export function ImageUpload({
    label,
    value,
    onChange,
    accept = "image/*",
    maxSize = 5,
    preview = true,
    placeholder = "Select an image or enter URL",
    error,
    className = "",
    allowUrl = true,
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [urlInput, setUrlInput] = useState(typeof value === 'string' ? value : '');
    const [inputMode, setInputMode] = useState<'upload' | 'url'>(
        typeof value === 'string' && value ? 'url' : 'upload'
    );

    const handleFileSelect = (file: File) => {
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        onChange(file);
        setInputMode('upload');
        setUrlInput('');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));
        
        if (imageFile) {
            handleFileSelect(imageFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUrlChange = (url: string) => {
        setUrlInput(url);
        if (url.trim()) {
            onChange(null, url.trim());
            setInputMode('url');
        }
    };

    const handleClear = () => {
        onChange(null);
        setUrlInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getPreviewUrl = () => {
        if (value instanceof File) {
            return URL.createObjectURL(value);
        }
        if (typeof value === 'string' && value) {
            return value;
        }
        return null;
    };

    const getFileName = () => {
        if (value instanceof File) {
            return value.name;
        }
        if (typeof value === 'string' && value) {
            return value.split('/').pop() || value;
        }
        return null;
    };

    const previewUrl = getPreviewUrl();

    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="flex items-center gap-2">
                {/* <ImageIcon className="w-4 h-4" /> */}
                {label}
            </Label>

            {allowUrl && (
                <div className="flex gap-2 mb-3">
                    <Button
                        type="button"
                        variant={inputMode === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputMode('upload')}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                    <Button
                        type="button"
                        variant={inputMode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputMode('url')}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        URL
                    </Button>
                </div>
            )}

            {inputMode === 'url' && allowUrl ? (
                <div className="space-y-2">
                    <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={urlInput}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className={error ? 'border-red-500' : ''}
                    />
                    <p className="text-sm text-muted-foreground">
                        Enter a direct link to an image (jpg, png, gif, webp)
                    </p>
                </div>
            ) : (
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                        ${error ? 'border-red-500' : ''}
                        hover:border-gray-400 hover:bg-gray-50
                    `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {value ? (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-green-600">
                                ✓ {getFileName()}
                            </div>
                            {value instanceof File && (
                                <div className="text-xs text-muted-foreground">
                                    {(value.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-gray-400" />
                            <div className="text-sm">
                                <span className="font-medium text-blue-600">Click to upload</span>
                                <span className="text-gray-600"> or drag and drop</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                PNG, JPG, GIF up to {maxSize}MB
                            </div>
                        </div>
                    )}
                </div>
            )}

            {preview && previewUrl && (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-w-md h-32 object-cover rounded-lg border"
                        onError={(e) => {
                            console.error('Image preview failed to load');
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleClear}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {value && !preview && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            )}

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <p className="text-sm text-muted-foreground">
                Recommended: 1200x630 pixels for optimal social media display
            </p>
        </div>
    );
}