import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';

interface TranslatableInputProps {
    label: string;
    name: string;
    type?: 'input' | 'textarea';
    placeholder?: string;
    values: {
        en: string;
        km: string;
    };
    errors?: {
        en?: string;
        km?: string;
    };
    onChange: (locale: 'en' | 'km', value: string) => void;
    required?: boolean;
    rows?: number;
}

export function TranslatableInput({
    label,
    name,
    type = 'input',
    placeholder,
    values,
    errors,
    onChange,
    required = false,
    rows = 3
}: TranslatableInputProps) {
    const [activeTab, setActiveTab] = useState<'en' | 'km'>('en');

    const languages = [
        { code: 'en' as const, name: 'English', flag: '🇺🇸' },
        { code: 'km' as const, name: 'ខ្មែរ', flag: '🇰🇭' }
    ];

    const InputComponent = type === 'textarea' ? Textarea : Input;

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'en' | 'km')}>
                <TabsList className="grid w-full grid-cols-2">
                    {languages.map((lang) => (
                        <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span className="hidden sm:inline">{lang.name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {languages.map((lang) => (
                    <TabsContent key={lang.code} value={lang.code} className="mt-4">
                        <InputComponent
                            id={`${name}_${lang.code}`}
                            value={values[lang.code] || ''}
                            onChange={(e) => onChange(lang.code, e.target.value)}
                            placeholder={`${placeholder} (${lang.name})`}
                            className={errors?.[lang.code] ? 'border-red-500' : ''}
                            {...(type === 'textarea' ? { rows } : {})}
                        />
                        {errors?.[lang.code] && (
                            <p className="text-sm text-red-500 mt-1">{errors[lang.code]}</p>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}