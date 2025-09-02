import { icons } from 'lucide-react';

interface DynamicLucideIconProps {
    name: string;
    className?: string;
    size?: number;
}

export function DynamicLucideIcon({ 
    name, 
    className = "w-4 h-4", 
    size 
}: DynamicLucideIconProps) {
    try {
        // Convert kebab-case to PascalCase for Lucide components
        const pascalCase = name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        
        const IconComponent = icons[pascalCase as keyof typeof icons];
        
        if (!IconComponent) {
            return (
                <div className={`border border-dashed border-gray-400 rounded flex items-center justify-center ${className}`}>
                    <span className="text-xs">?</span>
                </div>
            );
        }
        
        return <IconComponent className={className} size={size} />;
    } catch {
        return (
            <div className={`border border-dashed border-gray-400 rounded flex items-center justify-center ${className}`}>
                <span className="text-xs">?</span>
            </div>
        );
    }
}