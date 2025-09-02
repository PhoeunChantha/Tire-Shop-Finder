import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';
import { IconInput } from '@/components/ui/icon-input';
import { Business } from '@/types';
import { Building, Plus, Trash2, Wrench, Globe, Image } from 'lucide-react';

interface AdminServiceCreateProps {
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
    image: File | string | null;
    icon: string | null;
}

export default function AdminServiceCreate({ business }: AdminServiceCreateProps) {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    const [services, setServices] = useState<ServiceFormData[]>([
        { 
            name: '', 
            price: '', 
            descriptions: '', 
            name_translations: { en: '', km: '' },
            descriptions_translations: { en: '', km: '' },
            status: true,
            image: null,
            icon: null
        }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        services: [{ 
            name: '', 
            price: '', 
            descriptions: '', 
            name_translations: { en: '', km: '' },
            descriptions_translations: { en: '', km: '' },
            status: true,
            image: null,
            icon: null
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
            status: true,
            image: null,
            icon: null
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
        
        // Filter out empty services
        const validServices = services.filter(service => 
            service.name.trim() !== '' && service.price.trim() !== ''
        );

        if (validServices.length === 0) {
            return;
        }
        
        // Submit with filtered services
        post(route('admin.services.store', business.id), {
            data: { services: validServices }
        });
    };

    return (
        <AppLayout>
            <Head title={`Add Services - ${business.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Business: {business.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Add services and pricing for this tire shop business.
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Services Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Globe className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">Services & Pricing</h3>
                                </div>
                                
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
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        Service #{index + 1} (English)
                                                    </h4>
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

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Service Image */}
                                                    <div className="space-y-2">
                                                        <ImageUpload
                                                            label="Service Image"
                                                            value={service.image}
                                                            onChange={(file, url) => {
                                                                const newServices = [...services];
                                                                if (file) {
                                                                    newServices[index] = { ...newServices[index], image: file };
                                                                } else if (url) {
                                                                    newServices[index] = { ...newServices[index], image: url };
                                                                } else {
                                                                    newServices[index] = { ...newServices[index], image: null };
                                                                }
                                                                setServices(newServices);
                                                                setData('services', newServices);
                                                            }}
                                                            error={errors[`services.${index}.image`]}
                                                            placeholder="Upload service image or enter URL"
                                                        />
                                                    </div>

                                                    {/* Service Icon */}
                                                    <div className="space-y-2">
                                                        <IconInput
                                                            label="Service Icon"
                                                            value={service.icon || ''}
                                                            onChange={(iconName) => {
                                                                const newServices = [...services];
                                                                newServices[index] = { ...newServices[index], icon: iconName };
                                                                setServices(newServices);
                                                                setData('services', newServices);
                                                            }}
                                                            error={errors[`services.${index}.icon`]}
                                                            placeholder="battery-charging, wrench, car..."
                                                        />
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

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">Active Status</Label>
                                                        <div className="text-sm text-muted-foreground">
                                                            Enable or disable this service
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={service.status}
                                                        onCheckedChange={(checked) => handleServiceChange(index, 'status', checked)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>

                                    {/* Khmer Tab */}
                                    <TabsContent value="km" className="space-y-6">
                                        {services.map((service, index) => (
                                            <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-medium text-gray-900">
                                                        សេវាកម្ម #{index + 1} (ខ្មែរ)
                                                    </h4>
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
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Another Service
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <Link href={route('businesses.index')}>
                                    <Button type="button" variant="outline">
                                        Skip for Now
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} size="lg">
                                    {processing ? 'Adding Services...' : 'Add Services'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}