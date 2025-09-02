import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Business } from '@/types';
import { Building, Plus, Trash2, Wrench, Globe } from 'lucide-react';

interface ServiceCreateProps {
    business: Business;
}

interface ServiceFormData {
    name: string;
    price: string;
    descriptions: string;
    name_translations: {
        en: string;
        km: string;
    };
    descriptions_translations: {
        en: string;
        km: string;
    };
    status: boolean;
}

export default function ServiceCreate({ business }: ServiceCreateProps) {
    const { props } = usePage();
    const { flash } = props as any;
    const isAdminRedirect = flash?.admin_redirect;
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    
    const [services, setServices] = useState<ServiceFormData[]>([
        { 
            name: '', 
            price: '', 
            descriptions: '', 
            name_translations: { en: '', km: '' },
            descriptions_translations: { en: '', km: '' },
            status: true 
        }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        services: [{ 
            name: '', 
            price: '', 
            descriptions: '', 
            name_translations: { en: '', km: '' },
            descriptions_translations: { en: '', km: '' },
            status: true 
        }]
    });

    // Sync services state with form data on initial load
    useEffect(() => {
        setData('services', services);
    }, []);

    const handleServiceChange = (index: number, field: keyof ServiceFormData, value: string | boolean) => {
        const newServices = [...services];
        newServices[index] = { ...newServices[index], [field]: value };
        setServices(newServices);
        
        // Update the Inertia form data
        setData('services', newServices);
    };

    const addService = () => {
        const newServices = [...services, { 
            name: '', 
            price: '', 
            descriptions: '', 
            name_translations: { en: '', km: '' },
            descriptions_translations: { en: '', km: '' },
            status: true 
        }];
        setServices(newServices);
        setData('services', newServices);
    };

    const removeService = (index: number) => {
        if (services.length > 1) {
            const newServices = services.filter((_, i) => i !== index);
            setServices(newServices);
            setData('services', newServices);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Filter out services with empty names before submission
        const validServices = services.filter(service => 
            service.name.trim() !== '' || service.name_translations.en.trim() !== ''
        );
        
        // Make sure we have at least one valid service
        if (validServices.length === 0) {
            return;
        }
        
        // Submit with filtered services using transform
        post(`/businesses/${business.id}/services`, {
            transform: (data) => ({
                services: validServices
            })
        });
    };

    const skipServices = () => {
        window.location.href = '/user-dashboard';
    };

    return (
        <WebsiteLayout>
            <Head title={`Add Services - ${business.name}`} />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Add Your Services
                        </h1>
                        <p className="text-lg text-gray-600">
                            Great! Your business "{business.name}" is registered. Now let's add the services you offer.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Services & Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Language Tabs */}
                                <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'km')}>
                                    <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
                                        <TabsTrigger value="en" className="flex items-center gap-2">
                                            <span>🇺🇸</span>
                                            <span>English</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="km" className="flex items-center gap-2">
                                            <span>🇰🇭</span>
                                            <span>ខ្មែរ</span>
                                        </TabsTrigger>
                                    </TabsList>
                                    {/* English Tab */}
                                    <TabsContent value="en" className="space-y-6">
                                        {services.map((service, index) => (
                                            <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Service #{index + 1} (English)
                                                    </h3>
                                                    {services.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeService(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`service-name-en-${index}`}>
                                                            Service Name (English) <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id={`service-name-en-${index}`}
                                                            type="text"
                                                            value={service.name_translations.en}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const newServices = [...services];
                                                                newServices[index] = {
                                                                    ...newServices[index],
                                                                    name_translations: { ...newServices[index].name_translations, en: value },
                                                                    name: value // Also update main field
                                                                };
                                                                setServices(newServices);
                                                                setData('services', newServices);
                                                            }}
                                                            placeholder="e.g., Tire Installation, Wheel Balancing"
                                                            className={errors[`services.${index}.name_translations.en`] || errors[`services.${index}.name`] ? 'border-red-500' : ''}
                                                        />
                                                        {(errors[`services.${index}.name_translations.en`] || errors[`services.${index}.name`]) && (
                                                            <p className="text-sm text-red-500">{errors[`services.${index}.name_translations.en`] || errors[`services.${index}.name`]}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`service-price-${index}`}>
                                                            Price (USD) <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            id={`service-price-${index}`}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={service.price}
                                                            onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                                                            placeholder="0.00"
                                                            className={errors[`services.${index}.price`] ? 'border-red-500' : ''}
                                                        />
                                                        {errors[`services.${index}.price`] && (
                                                            <p className="text-sm text-red-500">{errors[`services.${index}.price`]}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`service-desc-en-${index}`}>Service Description (English)</Label>
                                                    <Textarea
                                                        id={`service-desc-en-${index}`}
                                                        value={service.descriptions_translations.en}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const newServices = [...services];
                                                            newServices[index] = {
                                                                ...newServices[index],
                                                                descriptions_translations: { ...newServices[index].descriptions_translations, en: value },
                                                                descriptions: value // Also update main field
                                                            };
                                                            setServices(newServices);
                                                            setData('services', newServices);
                                                        }}
                                                        placeholder="Describe what this service includes..."
                                                        rows={3}
                                                        className={errors[`services.${index}.descriptions_translations.en`] || errors[`services.${index}.descriptions`] ? 'border-red-500' : ''}
                                                    />
                                                    {(errors[`services.${index}.descriptions_translations.en`] || errors[`services.${index}.descriptions`]) && (
                                                        <p className="text-sm text-red-500">{errors[`services.${index}.descriptions_translations.en`] || errors[`services.${index}.descriptions`]}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`service-status-${index}`}
                                                        checked={service.status}
                                                        onCheckedChange={(checked) => handleServiceChange(index, 'status', checked as boolean)}
                                                    />
                                                    <Label htmlFor={`service-status-${index}`}>
                                                        Service is active and available
                                                    </Label>
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>

                                    {/* Khmer Tab */}
                                    <TabsContent value="km" className="space-y-6">
                                        {services.map((service, index) => (
                                            <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        សេវាកម្ម #{index + 1} (ខ្មែរ)
                                                    </h3>
                                                    {services.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeService(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            លុបចេញ
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`service-name-km-${index}`}>
                                                            ឈ្មោះសេវាកម្ម (ខ្មែរ)
                                                        </Label>
                                                        <Input
                                                            id={`service-name-km-${index}`}
                                                            type="text"
                                                            value={service.name_translations.km}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const newServices = [...services];
                                                                newServices[index] = {
                                                                    ...newServices[index],
                                                                    name_translations: { ...newServices[index].name_translations, km: value }
                                                                };
                                                                setServices(newServices);
                                                                setData('services', newServices);
                                                            }}
                                                            placeholder="ឧ. ការដំឡើងកង់ ការធ្វើតុល្យភាពកង់"
                                                            className={errors[`services.${index}.name_translations.km`] ? 'border-red-500' : ''}
                                                        />
                                                        {errors[`services.${index}.name_translations.km`] && (
                                                            <p className="text-sm text-red-500">{errors[`services.${index}.name_translations.km`]}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`service-desc-km-${index}`}>ការពិពណ៌នាសេវាកម្ម (ខ្មែរ)</Label>
                                                        <Textarea
                                                            id={`service-desc-km-${index}`}
                                                            value={service.descriptions_translations.km}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const newServices = [...services];
                                                                newServices[index] = {
                                                                    ...newServices[index],
                                                                    descriptions_translations: { ...newServices[index].descriptions_translations, km: value }
                                                                };
                                                                setServices(newServices);
                                                                setData('services', newServices);
                                                            }}
                                                            placeholder="ពិពណ៌នាអំពីអ្វីដែលសេវាកម្មនេះរួមបញ្ចូល..."
                                                            rows={3}
                                                            className={errors[`services.${index}.descriptions_translations.km`] ? 'border-red-500' : ''}
                                                        />
                                                        {errors[`services.${index}.descriptions_translations.km`] && (
                                                            <p className="text-sm text-red-500">{errors[`services.${index}.descriptions_translations.km`]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>
                                </Tabs>

                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addService}
                                        className="w-full max-w-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Another Service
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center space-x-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={skipServices}
                                        size="lg"
                                    >
                                        Skip for Now
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing || services.every(s => !s.name.trim() && !s.name_translations.en.trim())} 
                                        size="lg"
                                    >
                                        {processing ? 'Creating Services...' : `Create ${services.filter(s => s.name.trim() !== '' || s.name_translations.en.trim() !== '').length} Service${services.filter(s => s.name.trim() !== '' || s.name_translations.en.trim() !== '').length !== 1 ? 's' : ''}`}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </WebsiteLayout>
    );
}