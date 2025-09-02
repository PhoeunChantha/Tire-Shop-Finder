import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Business } from '@/types';
import { ArrowLeft, Globe, Save } from 'lucide-react';

interface ServiceEditProps {
    business: Business;
    service: any;
}

export default function ServiceEdit({ business, service }: ServiceEditProps) {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || '',
        price: service.price || '',
        descriptions: service.descriptions || '',
        name_translations: service.name_translations || { en: service.name || '', km: '' },
        descriptions_translations: service.descriptions_translations || { en: service.descriptions || '', km: '' },
        status: service.status ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/businesses/${business.slug}/services/${service.id}`);
    };

    const handleNameTranslationChange = (locale: 'en' | 'km', value: string) => {
        const newTranslations = { ...data.name_translations, [locale]: value };
        setData({
            ...data,
            name_translations: newTranslations,
            name: value // Update main field for English
        });
    };

    const handleDescriptionsTranslationChange = (locale: 'en' | 'km', value: string) => {
        const newTranslations = { ...data.descriptions_translations, [locale]: value };
        setData({
            ...data,
            descriptions_translations: newTranslations,
            descriptions: value // Update main field for English
        });
    };

    return (
        <WebsiteLayout>
            <Head title={`Edit Service - ${service.name} - ${business.name}`} />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/user-dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Dashboard
                        </Link>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Edit Service
                            </h1>
                            <p className="text-lg text-gray-600">
                                Update your service details for "{business.name}"
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Service Details
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
                                        <div className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Service Details (English)
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="service-name-en">
                                                        Service Name (English) <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="service-name-en"
                                                        type="text"
                                                        value={data.name_translations.en}
                                                        onChange={(e) => handleNameTranslationChange('en', e.target.value)}
                                                        placeholder="e.g., Tire Installation, Wheel Balancing"
                                                        className={errors.name_translations?.en || errors.name ? 'border-red-500' : ''}
                                                    />
                                                    {(errors.name_translations?.en || errors.name) && (
                                                        <p className="text-sm text-red-500">{errors.name_translations?.en || errors.name}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="service-price">
                                                        Price (USD) <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="service-price"
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

                                            <div className="space-y-2">
                                                <Label htmlFor="service-desc-en">Service Description (English)</Label>
                                                <Textarea
                                                    id="service-desc-en"
                                                    value={data.descriptions_translations.en}
                                                    onChange={(e) => handleDescriptionsTranslationChange('en', e.target.value)}
                                                    placeholder="Describe what this service includes..."
                                                    rows={3}
                                                    className={errors.descriptions_translations?.en || errors.descriptions ? 'border-red-500' : ''}
                                                />
                                                {(errors.descriptions_translations?.en || errors.descriptions) && (
                                                    <p className="text-sm text-red-500">{errors.descriptions_translations?.en || errors.descriptions}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="service-status"
                                                    checked={data.status}
                                                    onCheckedChange={(checked) => setData('status', checked as boolean)}
                                                />
                                                <Label htmlFor="service-status">
                                                    Service is active and available
                                                </Label>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Khmer Tab */}
                                    <TabsContent value="km" className="space-y-6">
                                        <div className="border rounded-lg p-6 space-y-4 bg-gray-50">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                សេវាកម្ម (ខ្មែរ)
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="service-name-km">
                                                        ឈ្មោះសេវាកម្ម (ខ្មែរ)
                                                    </Label>
                                                    <Input
                                                        id="service-name-km"
                                                        type="text"
                                                        value={data.name_translations.km}
                                                        onChange={(e) => handleNameTranslationChange('km', e.target.value)}
                                                        placeholder="ឧ. ការដំឡើងកង់ ការធ្វើតុល្យភាពកង់"
                                                        className={errors.name_translations?.km ? 'border-red-500' : ''}
                                                    />
                                                    {errors.name_translations?.km && (
                                                        <p className="text-sm text-red-500">{errors.name_translations.km}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="service-desc-km">ការពិពណ៌នាសេវាកម្ម (ខ្មែរ)</Label>
                                                    <Textarea
                                                        id="service-desc-km"
                                                        value={data.descriptions_translations.km}
                                                        onChange={(e) => handleDescriptionsTranslationChange('km', e.target.value)}
                                                        placeholder="ពិពណ៌នាអំពីអ្វីដែលសេវាកម្មនេះរួមបញ្ចូល..."
                                                        rows={3}
                                                        className={errors.descriptions_translations?.km ? 'border-red-500' : ''}
                                                    />
                                                    {errors.descriptions_translations?.km && (
                                                        <p className="text-sm text-red-500">{errors.descriptions_translations.km}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex justify-between items-center space-x-4 pt-6 border-t">
                                    <Link href="/user-dashboard">
                                        <Button type="button" variant="outline" size="lg">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="submit" 
                                        disabled={processing} 
                                        size="lg"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Updating Service...' : 'Update Service'}
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