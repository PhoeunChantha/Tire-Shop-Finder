import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { DynamicLucideIcon } from './dynamic-lucide-icon';

interface IconInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
    placeholder?: string;
}

export function IconInput({
    label,
    value,
    onChange,
    error,
    className = '',
    placeholder = 'e.g., battery-charging, wrench, car'
}: IconInputProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="text-sm font-medium">{label}</Label>
            
            <div className="flex items-center gap-3">
                {/* Icon Preview */}
                <div className="flex-shrink-0 w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                    {value ? (
                        <DynamicLucideIcon name={value} className="w-5 h-5" />
                    ) : (
                        <span className="text-gray-400 text-xs">Icon</span>
                    )}
                </div>
                
                {/* Input Field */}
                <div className="flex-1">
                    <Input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={error ? 'border-red-500' : ''}
                    />
                </div>
            </div>
            
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
            
            <p className="text-xs text-muted-foreground">
                Enter Lucide icon name from <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">lucide.dev</a> (e.g., battery-charging)
            </p>
        </div>
    );
}