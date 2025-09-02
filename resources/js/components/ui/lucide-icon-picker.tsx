import React, { useState, useMemo } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { ScrollArea } from './scroll-area';
import { Card, CardContent } from './card';
import { DynamicLucideIcon } from './dynamic-lucide-icon';
import { Search, X } from 'lucide-react';

// Common service-related icon names (as they appear on lucide.dev)
const COMMON_SERVICE_ICONS = [
    'wrench',
    'settings', 
    'car',
    'battery',
    'battery-charging',
    'zap',
    'gauge',
    'thermometer',
    'wind',
    'shield',
    'hammer',
    'cog',
    'circuit-board',
    'timer',
    'clock',
    'check-circle',
    'alert-triangle',
    'info',
    'star',
    'truck',
    'package',
    'box',
    'heart',
    'award',
    'target',
    'clipboard',
    'file-text',
    'calendar',
    'map-pin',
    'drill',
    'paint-brush',
    'scissors',
    'spanner',
    'rotate-cw',
    'refresh-cw',
    'power',
    'plug',
    'cpu',
    'hard-drive',
    'server',
    'smartphone',
    'laptop',
    'monitor',
    'headphones',
    'speaker',
    'wifi'
];

interface LucideIconPickerProps {
    label: string;
    value?: string;
    onChange: (iconName: string | null) => void;
    error?: string;
    className?: string;
    placeholder?: string;
}

export function LucideIconPicker({
    label,
    value,
    onChange,
    error,
    className = '',
    placeholder = 'Search icons...'
}: LucideIconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customIconInput, setCustomIconInput] = useState('');


    const filteredIcons = useMemo(() => {
        if (!searchTerm) return COMMON_SERVICE_ICONS;
        
        return COMMON_SERVICE_ICONS.filter(iconName =>
            iconName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleIconSelect = (iconName: string) => {
        onChange(iconName);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleCustomIconAdd = () => {
        if (customIconInput.trim()) {
            onChange(customIconInput.trim());
            setIsOpen(false);
            setCustomIconInput('');
        }
    };

    const handleClear = () => {
        onChange(null);
        setIsOpen(false);
    };


    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="text-sm font-medium">{label}</Label>
            
            {/* Selected Icon Display */}
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 h-10 px-3"
                >
                    {value ? (
                        <>
                            <DynamicLucideIcon name={value} className="w-4 h-4" />
                            <span className="text-sm">{value}</span>
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">Select Icon</span>
                        </>
                    )}
                </Button>
                
                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="h-8 w-8 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Icon Picker Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
                    <Card className="w-full max-w-md max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Select Icon</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={placeholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Icon Grid */}
                            <ScrollArea className="h-64">
                                <div className="grid grid-cols-4 gap-2 p-1">
                                    {filteredIcons.map((iconName) => (
                                        <Button
                                            key={iconName}
                                            type="button"
                                            variant={value === iconName ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => handleIconSelect(iconName)}
                                            className="flex flex-col items-center gap-1 h-auto py-3 px-2"
                                            title={iconName}
                                        >
                                            <DynamicLucideIcon name={iconName} className="w-5 h-5" />
                                            <span className="text-xs text-center leading-tight">
                                                {iconName}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                                
                                {filteredIcons.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Search className="w-8 h-8 mx-auto mb-2" />
                                        <p>No icons found</p>
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Custom Icon Input */}
                            <div className="pt-4 border-t">
                                <Label className="text-sm font-medium mb-2 block">
                                    Or enter custom icon name from lucide.dev:
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="e.g., battery-charging"
                                        value={customIconInput}
                                        onChange={(e) => setCustomIconInput(e.target.value)}
                                        className="text-sm"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleCustomIconAdd();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleCustomIconAdd}
                                        size="sm"
                                        disabled={!customIconInput.trim()}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Copy icon name from lucide.dev (e.g., "battery-charging")
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}