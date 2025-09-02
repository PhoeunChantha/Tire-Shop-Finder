import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
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
import { Business, Service } from '@/types';
import { Wrench, ArrowLeft, Globe, Image } from 'lucide-react';

interface AdminServiceEditProps {
    service: Service;
    business: Business;
}

export default function AdminServiceEdit({ service, business }: AdminServiceEditProps) {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || '',
        price: service.price || '',
        descriptions: service.descriptions || '',
        name_translations: service.name_translations || { en: service.name || '', km: '' },
        descriptions_translations: service.descriptions_translations || { en: service.descriptions || '', km: '' },
        status: service.status ?? true,
        image: service.image || null as File | string | null,
        icon: service.icon || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.services.update', service.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Service - ${service.name} - ${business.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
                        <p className="text-gray-600">{business.name}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Service Details
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Update service information and pricing.
                            </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name_en">
                                                    Service Name (English) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name_en"
                                                    type="text"
                                                    value={data.name_translations.en}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setData('name_translations', {
                                                            ...data.name_translations,
                                                            en: value
                                                        });
                                                        setData('name', value);
                                                    }}
                                                    placeholder="e.g., Tire Installation, Wheel Balancing"
                                                    className={errors['name_translations.en'] || errors.name ? 'border-red-500' : ''}
                                                />
                                                {(errors['name_translations.en'] || errors.name) && (
                                                    <p className="text-sm text-red-500">{errors['name_translations.en'] || errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="price">
                                                    Price (USD) <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    placeholder="0.00"
                                                    className={errors.price ? 'border-red-500' : ''}
                                                />
                                                {errors.price && (
                                                    <p className="text-sm text-red-500">{errors.price}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Service Image */}
                                            <div className="space-y-2">
                                                <ImageUpload
                                                    label="Service Image"
                                                    value={data.image}
                                                    onChange={(file, url) => {
                                                        if (file) {
                                                            setData('image', file);
                                                        } else if (url) {
                                                            setData('image', url);
                                                        } else {
                                                            setData('image', null);
                                                        }
                                                    }}
                                                    error={errors.image}
                                                    placeholder="Upload service image or enter URL"
                                                />
                                            </div>

                                            {/* Service Icon */}
                                            <div className="space-y-2">
                                                <IconInput
                                                    label="Service Icon"
                                                    value={data.icon || ''}
                                                    onChange={(iconName) => {
                                                        setData('icon', iconName);
                                                    }}
                                                    error={errors.icon}
                                                    placeholder="battery-charging, wrench, car..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="descriptions_en">Service Description (English)</Label>
                                            <Textarea
                                                id="descriptions_en"
                                                value={data.descriptions_translations.en}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setData('descriptions_translations', {
                                                        ...data.descriptions_translations,
                                                        en: value
                                                    });
                                                    setData('descriptions', value);
                                                }}
                                                placeholder="Describe what this service includes..."
                                                rows={4}
                                                className={errors['descriptions_translations.en'] || errors.descriptions ? 'border-red-500' : ''}
                                            />
                                            {(errors['descriptions_translations.en'] || errors.descriptions) && (
                                                <p className="text-sm text-red-500">{errors['descriptions_translations.en'] || errors.descriptions}</p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Khmer Tab */}
                                    <TabsContent value="km" className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name_km">
                                                ឈ្មោះសេវាកម្ម (ខ្មែរ)
                                            </Label>
                                            <Input
                                                id="name_km"
                                                type="text"
                                                value={data.name_translations.km}
                                                onChange={(e) => {
                                                    setData('name_translations', {
                                                        ...data.name_translations,
                                                        km: e.target.value
                                                    });
                                                }}
                                                placeholder="ឧ. ការដំឡើងកង់ ការធ្វើតុល្យភាពកង់"
                                                className={errors['name_translations.km'] ? 'border-red-500' : ''}
                                            />
                                            {errors['name_translations.km'] && (
                                                <p className="text-sm text-red-500">{errors['name_translations.km']}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="descriptions_km">ការពិពណ៌នាសេវាកម្ម (ខ្មែរ)</Label>
                                            <Textarea
                                                id="descriptions_km"
                                                value={data.descriptions_translations.km}
                                                onChange={(e) => {
                                                    setData('descriptions_translations', {
                                                        ...data.descriptions_translations,
                                                        km: e.target.value
                                                    });
                                                }}
                                                placeholder="ពិពណ៌នាអំពីអ្វីដែលសេវាកម្មនេះរួមបញ្ចូល..."
                                                rows={4}
                                                className={errors['descriptions_translations.km'] ? 'border-red-500' : ''}
                                            />
                                            {errors['descriptions_translations.km'] && (
                                                <p className="text-sm text-red-500">{errors['descriptions_translations.km']}</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Active Status</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Enable or disable this service
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.status}
                                        onCheckedChange={(checked) => setData('status', checked)}
                                    />
                                </div>

                                <div className="flex justify-between pt-6 border-t">
                                    <Link href={route('businesses.show', business.id)}>
                                        <Button type="button" variant="outline">
                                            <ArrowLeft className="w-4 h-4 mr-1" />
                                            Back to Business
                                        </Button>
                                    </Link>
                                    <div className="flex space-x-4">
                                        <Button type="button" variant="outline" onClick={() => router.get(route('businesses.show', business.id))}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Service'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}