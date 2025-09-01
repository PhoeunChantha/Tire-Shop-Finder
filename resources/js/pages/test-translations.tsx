import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';
import WebsiteLayout from '@/layouts/website-layout';

export default function TestTranslations() {
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');
    const { data, setData, processing, errors } = useForm({
        name_translations: {
            en: '',
            km: ''
        },
        descriptions_translations: {
            en: '',
            km: ''
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', data);
        alert('Check console for form data');
    };

    return (
        <WebsiteLayout>
            <Head title="Test Translations" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Test Translation Form - Single Tab System
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as 'en' | 'km')}>
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="en" className="flex items-center gap-2">
                                            <span>🇺🇸</span>
                                            <span>English</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="km" className="flex items-center gap-2">
                                            <span>🇰🇭</span>
                                            <span>ខ្មែរ</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="en" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name_en">Business Name (English)</Label>
                                            <Input
                                                id="name_en"
                                                type="text"
                                                value={data.name_translations.en}
                                                onChange={(e) => setData('name_translations', {
                                                    ...data.name_translations,
                                                    en: e.target.value
                                                })}
                                                placeholder="e.g., Phnom Penh Tire Center"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="descriptions_en">Business Description (English)</Label>
                                            <Textarea
                                                id="descriptions_en"
                                                value={data.descriptions_translations.en}
                                                onChange={(e) => setData('descriptions_translations', {
                                                    ...data.descriptions_translations,
                                                    en: e.target.value
                                                })}
                                                placeholder="Tell customers about your tire shop..."
                                                rows={3}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="km" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name_km">ឈ្មោះអាជីវកម្ម (ខ្មែរ)</Label>
                                            <Input
                                                id="name_km"
                                                type="text"
                                                value={data.name_translations.km}
                                                onChange={(e) => setData('name_translations', {
                                                    ...data.name_translations,
                                                    km: e.target.value
                                                })}
                                                placeholder="ឧ. ហាងកង់ភ្នំពេញ"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="descriptions_km">ការពិពណ៌នាអាជីវកម្ម (ខ្មែរ)</Label>
                                            <Textarea
                                                id="descriptions_km"
                                                value={data.descriptions_translations.km}
                                                onChange={(e) => setData('descriptions_translations', {
                                                    ...data.descriptions_translations,
                                                    km: e.target.value
                                                })}
                                                placeholder="ប្រាប់អតិថិជនអំពីហាងកង់របស់អ្នក..."
                                                rows={3}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <Button type="submit" disabled={processing}>
                                    Test Form Data
                                </Button>
                                
                                <div className="mt-6 p-4 bg-gray-100 rounded">
                                    <h3 className="font-bold">Current Active Tab: {activeLanguage === 'en' ? '🇺🇸 English' : '🇰🇭 ខ្មែរ'}</h3>
                                    <h3 className="font-bold mt-2">Current Form Data:</h3>
                                    <pre className="text-sm mt-2">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </WebsiteLayout>
    );
}