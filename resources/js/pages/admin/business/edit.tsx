import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TimeRangePicker } from '@/components/ui/time-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOFields } from '@/components/seo-fields';
import { ImageUpload } from '@/components/ui/image-upload';
import { BusinessEditProps, District, Commune, Village } from '@/types';
import { ArrowLeft, Building, MapPin, Settings, Plus, Edit, Globe, Image } from 'lucide-react';
import { router } from '@inertiajs/react';
import { getImageUrl } from '@/lib/imageHelper';
import axios from 'axios';

export default function BusinessEdit({ auth, business, provinces }: BusinessEditProps) {
    const [districts, setDistricts] = useState<District[]>([]);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');

    const { data, setData, put, processing, errors } = useForm({
        name: business.name || '',
        descriptions: business.descriptions || '',
        name_translations: business.name_translations || { en: business.name || '', km: '' },
        descriptions_translations: business.descriptions_translations || { en: business.descriptions || '', km: '' },
        province_id: business.province_id?.toString() || '',
        district_id: business.district_id?.toString() || '',
        commune_id: business.commune_id?.toString() || '',
        village_id: business.village_id?.toString() || '',
        latitude: business.latitude || '',
        longitude: business.longitude || '',
        opening_time: business.opening_time || '',
        closing_time: business.closing_time || '',
        status: business.status ?? false,
        is_vierify: business.is_vierify ?? false,
        seo_title: business.seo_title || '',
        seo_description: business.seo_description || '',
        seo_title_translations: business.seo_title_translations || { en: business.seo_title || '', km: '' },
        seo_description_translations: business.seo_description_translations || { en: business.seo_description || '', km: '' },
        seo_image: business.seo_image ? (business.seo_image.startsWith('http') || business.seo_image.startsWith('/') ? business.seo_image : getImageUrl(business.seo_image, 'businesses')) : '' as string | File,
        seo_keywords: business.seo_keywords || [],
        image: business.image ? getImageUrl(business.image, 'businesses') : null as File | string | null,
    });

    // Load initial districts if province is selected
    useEffect(() => {
        if (business.province_id) {
            loadDistricts(business.province_id.toString());
        }
    }, []);

    // Load initial communes if district is selected
    useEffect(() => {
        if (business.district_id && districts.length > 0) {
            loadCommunes(business.district_id.toString());
        }
    }, [districts]);

    // Load initial villages if commune is selected
    useEffect(() => {
        if (business.commune_id && communes.length > 0) {
            loadVillages(business.commune_id.toString());
        }
    }, [communes]);

    const loadDistricts = async (provinceId: string) => {
        if (provinceId) {
            try {
                const response = await axios.get(`/api/districts/${provinceId}`);
                setDistricts(response.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        }
    };

    const loadCommunes = async (districtId: string) => {
        if (districtId) {
            try {
                const response = await axios.get(`/api/communes/${districtId}`);
                setCommunes(response.data);
            } catch (error) {
                console.error('Error fetching communes:', error);
            }
        }
    };

    const loadVillages = async (communeId: string) => {
        if (communeId) {
            try {
                const response = await axios.get(`/api/villages/${communeId}`);
                setVillages(response.data);
            } catch (error) {
                console.error('Error fetching villages:', error);
            }
        }
    };

    const handleProvinceChange = async (provinceId: string) => {
        setData('province_id', provinceId);
        setData('district_id', '');
        setData('commune_id', '');
        setData('village_id', '');

        setDistricts([]);
        setCommunes([]);
        setVillages([]);

        await loadDistricts(provinceId);
    };

    const handleDistrictChange = async (districtId: string) => {
        setData('district_id', districtId);
        setData('commune_id', '');
        setData('village_id', '');

        setCommunes([]);
        setVillages([]);

        await loadCommunes(districtId);
    };

    const handleCommuneChange = async (communeId: string) => {
        setData('commune_id', communeId);
        setData('village_id', '');

        setVillages([]);

        await loadVillages(communeId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { ...data };
        formData._method = 'PUT';
        router.post(`/admin/businesses/${business.id}`, formData);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${business.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Edit Business</h1>
                                <p className="text-gray-600">{business.name}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Business Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="w-5 h-5" />
                                            Business Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Language Tabs for Business Information */}
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

                                            <TabsContent value="en" className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name_en">Business Name (English) *</Label>
                                                    <Input
                                                        id="name_en"
                                                        type="text"
                                                        value={data.name_translations?.en || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setData('name_translations', {
                                                                ...data.name_translations,
                                                                en: value
                                                            });
                                                            // Also update main field
                                                            setData('name', value);
                                                        }}
                                                        placeholder="e.g., Phnom Penh Tire Center"
                                                        className={`max-w-2xl ${errors['name_translations.en'] || errors.name ? 'border-red-500' : ''}`}
                                                    />
                                                    {(errors['name_translations.en'] || errors.name) && (
                                                        <p className="text-sm text-red-500">{errors['name_translations.en'] || errors.name}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="descriptions_en">Business Description (English)</Label>
                                                    <Textarea
                                                        id="descriptions_en"
                                                        value={data.descriptions_translations?.en || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setData('descriptions_translations', {
                                                                ...data.descriptions_translations,
                                                                en: value
                                                            });
                                                            // Also update main field
                                                            setData('descriptions', value);
                                                        }}
                                                        placeholder="Tell customers about the tire shop, services, and specialties..."
                                                        rows={3}
                                                        className={`max-w-2xl ${errors['descriptions_translations.en'] || errors.descriptions ? 'border-red-500' : ''}`}
                                                    />
                                                    {(errors['descriptions_translations.en'] || errors.descriptions) && (
                                                        <p className="text-sm text-red-500">{errors['descriptions_translations.en'] || errors.descriptions}</p>
                                                    )}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="km" className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name_km">ឈ្មោះអាជីវកម្ម (ខ្មែរ)</Label>
                                                    <Input
                                                        id="name_km"
                                                        type="text"
                                                        value={data.name_translations?.km || ''}
                                                        onChange={(e) => {
                                                            setData('name_translations', {
                                                                ...data.name_translations,
                                                                km: e.target.value
                                                            });
                                                        }}
                                                        placeholder="ឧ. ហាងកង់ភ្នំពេញ"
                                                        className={`max-w-2xl ${errors['name_translations.km'] ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors['name_translations.km'] && (
                                                        <p className="text-sm text-red-500">{errors['name_translations.km']}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="descriptions_km">ការពិពណ៌នាអាជីវកម្ម (ខ្មែរ)</Label>
                                                    <Textarea
                                                        id="descriptions_km"
                                                        value={data.descriptions_translations?.km || ''}
                                                        onChange={(e) => {
                                                            setData('descriptions_translations', {
                                                                ...data.descriptions_translations,
                                                                km: e.target.value
                                                            });
                                                        }}
                                                        placeholder="ប្រាប់អតិថិជនអំពីហាងកង់ សេវាកម្ម និងជំនាញ..."
                                                        rows={3}
                                                        className={`max-w-2xl ${errors['descriptions_translations.km'] ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors['descriptions_translations.km'] && (
                                                        <p className="text-sm text-red-500">{errors['descriptions_translations.km']}</p>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        {/* Business Hours */}
                                        <div className="space-y-2 pt-4 border-t">
                                            <Label>Business Hours</Label>
                                            <TimeRangePicker
                                                startTime={data.opening_time}
                                                endTime={data.closing_time}
                                                onStartTimeChange={(time) => setData('opening_time', time)}
                                                onEndTimeChange={(time) => setData('closing_time', time)}
                                                startError={errors.opening_time}
                                                endError={errors.closing_time}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Location Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Location Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Province *</Label>
                                                <Select value={data.province_id} onValueChange={handleProvinceChange}>
                                                    <SelectTrigger className={errors.province_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select Province" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {provinces.map((province) => (
                                                            <SelectItem key={province.id} value={province.id.toString()}>
                                                                {province.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.province_id && (
                                                    <p className="text-sm text-red-500">{errors.province_id}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>District *</Label>
                                                <Select value={data.district_id} onValueChange={handleDistrictChange} disabled={!data.province_id}>
                                                    <SelectTrigger className={errors.district_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select District" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {districts.map((district) => (
                                                            <SelectItem key={district.id} value={district.id.toString()}>
                                                                {district.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.district_id && (
                                                    <p className="text-sm text-red-500">{errors.district_id}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Commune</Label>
                                                <Select value={data.commune_id} onValueChange={handleCommuneChange} disabled={!data.district_id}>
                                                    <SelectTrigger className={errors.commune_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select Commune" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {communes.map((commune) => (
                                                            <SelectItem key={commune.id} value={commune.id.toString()}>
                                                                {commune.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.commune_id && (
                                                    <p className="text-sm text-red-500">{errors.commune_id}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Village</Label>
                                                <Select value={data.village_id} onValueChange={(value) => setData('village_id', value)} disabled={!data.commune_id}>
                                                    <SelectTrigger className={errors.village_id ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select Village" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {villages.map((village) => (
                                                            <SelectItem key={village.id} value={village.id.toString()}>
                                                                {village.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.village_id && (
                                                    <p className="text-sm text-red-500">{errors.village_id}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="latitude">Latitude</Label>
                                                <Input
                                                    id="latitude"
                                                    type="text"
                                                    value={data.latitude}
                                                    onChange={(e) => setData('latitude', e.target.value)}
                                                    placeholder="11.5564"
                                                    className={errors.latitude ? 'border-red-500' : ''}
                                                />
                                                {errors.latitude && (
                                                    <p className="text-sm text-red-500">{errors.latitude}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="longitude">Longitude</Label>
                                                <Input
                                                    id="longitude"
                                                    type="text"
                                                    value={data.longitude}
                                                    onChange={(e) => setData('longitude', e.target.value)}
                                                    placeholder="104.9282"
                                                    className={errors.longitude ? 'border-red-500' : ''}
                                                />
                                                {errors.longitude && (
                                                    <p className="text-sm text-red-500">{errors.longitude}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* SEO Fields */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="w-5 h-5" />
                                            SEO Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Language Tabs for SEO */}
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

                                            <TabsContent value="en" className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="seo_title_en">SEO Title (English)</Label>
                                                    <Input
                                                        id="seo_title_en"
                                                        type="text"
                                                        value={data.seo_title_translations?.en || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setData('seo_title_translations', {
                                                                ...data.seo_title_translations,
                                                                en: value
                                                            });
                                                            setData('seo_title', value);
                                                        }}
                                                        placeholder="SEO title for search engines"
                                                        className={`max-w-2xl ${errors['seo_title_translations.en'] || errors.seo_title ? 'border-red-500' : ''}`}
                                                    />
                                                    <div className="text-sm text-muted-foreground">
                                                        {(data.seo_title_translations?.en || '').length}/60 characters
                                                        {(data.seo_title_translations?.en || '').length > 60 && (
                                                            <span className="text-amber-600 ml-2">May be truncated in search results</span>
                                                        )}
                                                    </div>
                                                    {(errors['seo_title_translations.en'] || errors.seo_title) && (
                                                        <p className="text-sm text-red-500">{errors['seo_title_translations.en'] || errors.seo_title}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="seo_description_en">SEO Description (English)</Label>
                                                    <Textarea
                                                        id="seo_description_en"
                                                        value={data.seo_description_translations?.en || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setData('seo_description_translations', {
                                                                ...data.seo_description_translations,
                                                                en: value
                                                            });
                                                            setData('seo_description', value);
                                                        }}
                                                        placeholder="SEO description for search engines (150-160 characters recommended)"
                                                        rows={3}
                                                        className={`max-w-2xl ${errors['seo_description_translations.en'] || errors.seo_description ? 'border-red-500' : ''}`}
                                                    />
                                                    <div className="text-sm text-muted-foreground">
                                                        {(data.seo_description_translations?.en || '').length}/160 characters
                                                        {(data.seo_description_translations?.en || '').length > 160 && (
                                                            <span className="text-amber-600 ml-2">May be truncated in search results</span>
                                                        )}
                                                    </div>
                                                    {(errors['seo_description_translations.en'] || errors.seo_description) && (
                                                        <p className="text-sm text-red-500">{errors['seo_description_translations.en'] || errors.seo_description}</p>
                                                    )}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="km" className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="seo_title_km">ចំណងជើង SEO (ខ្មែរ)</Label>
                                                    <Input
                                                        id="seo_title_km"
                                                        type="text"
                                                        value={data.seo_title_translations?.km || ''}
                                                        onChange={(e) => {
                                                            setData('seo_title_translations', {
                                                                ...data.seo_title_translations,
                                                                km: e.target.value
                                                            });
                                                        }}
                                                        placeholder="ចំណងជើង SEO សម្រាប់ម៉ាស៊ីនស្វែងរក"
                                                        className={`max-w-2xl ${errors['seo_title_translations.km'] ? 'border-red-500' : ''}`}
                                                    />
                                                    <div className="text-sm text-muted-foreground">
                                                        {(data.seo_title_translations?.km || '').length}/60 តួអក្សរ
                                                    </div>
                                                    {errors['seo_title_translations.km'] && (
                                                        <p className="text-sm text-red-500">{errors['seo_title_translations.km']}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="seo_description_km">ការពិពណ៌នា SEO (ខ្មែរ)</Label>
                                                    <Textarea
                                                        id="seo_description_km"
                                                        value={data.seo_description_translations?.km || ''}
                                                        onChange={(e) => {
                                                            setData('seo_description_translations', {
                                                                ...data.seo_description_translations,
                                                                km: e.target.value
                                                            });
                                                        }}
                                                        placeholder="ការពិពណ៌នា SEO សម្រាប់ម៉ាស៊ីនស្វែងរក"
                                                        rows={3}
                                                        className={`max-w-2xl ${errors['seo_description_translations.km'] ? 'border-red-500' : ''}`}
                                                    />
                                                    <div className="text-sm text-muted-foreground">
                                                        {(data.seo_description_translations?.km || '').length}/160 តួអក្សរ
                                                    </div>
                                                    {errors['seo_description_translations.km'] && (
                                                        <p className="text-sm text-red-500">{errors['seo_description_translations.km']}</p>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        {/* SEO Image and Keywords */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="space-y-4">
                                                {/* SEO Image */}
                                                <div className="space-y-2">
                                                    <ImageUpload
                                                        label="SEO Image"
                                                        value={data.seo_image}
                                                        onChange={(file, url) => {
                                                            if (file) {
                                                                setData('seo_image', file);
                                                            } else if (url) {
                                                                setData('seo_image', url);
                                                            } else {
                                                                setData('seo_image', '');
                                                            }
                                                        }}
                                                        error={errors.seo_image}
                                                        placeholder="Upload SEO image or enter URL (1200x630 recommended)"
                                                        maxSize={10}
                                                    />
                                                </div>

                                                {/* SEO Keywords */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="seo_keywords">SEO Keywords (comma-separated)</Label>
                                                    <Input
                                                        id="seo_keywords"
                                                        type="text"
                                                        value={data.seo_keywords.join(', ')}
                                                        onChange={(e) => {
                                                            const keywords = e.target.value
                                                                .split(',')
                                                                .map(k => k.trim())
                                                                .filter(k => k.length > 0);
                                                            setData('seo_keywords', keywords);
                                                        }}
                                                        placeholder="tire, car, automotive, repair, service"
                                                        className={`max-w-2xl ${errors.seo_keywords ? 'border-red-500' : ''}`}
                                                    />
                                                    {errors.seo_keywords && (
                                                        <p className="text-sm text-red-500">{errors.seo_keywords}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Business Services */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="w-5 h-5" />
                                                Services ({business.services?.length || 0})
                                            </CardTitle>
                                            <Link href={route('admin.services.create', business.id)}>
                                                <Button type="button" size="sm">
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add Service
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {business.services && business.services.length > 0 ? (
                                            <div className="space-y-3">
                                                {business.services.map((service: any) => (
                                                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                                                            {service.description && (
                                                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                            )}
                                                            {service.price && (
                                                                <p className="text-sm font-medium text-green-600 mt-1">
                                                                    ${service.price}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link href={route('admin.services.edit', service.id)}>
                                                                <Button type="button" size="sm" variant="outline">
                                                                    <Edit className="w-3 h-3" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6">
                                                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                <h3 className="text-sm font-medium text-gray-900 mb-1">No services added yet</h3>
                                                <p className="text-sm text-gray-600 mb-3">Add services to this business.</p>
                                                <Link href={route('admin.services.create', business.id)}>
                                                    <Button type="button" size="sm">
                                                        <Plus className="w-4 h-4 mr-1" />
                                                        Add First Service
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Status Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="w-5 h-5" />
                                            Status Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="status"
                                                checked={data.status}
                                                onCheckedChange={(checked) => setData('status', checked as boolean)}
                                            />
                                            <Label htmlFor="status" className="text-sm font-medium">
                                                Active Status
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_vierify"
                                                checked={data.is_vierify}
                                                onCheckedChange={(checked) => setData('is_vierify', checked as boolean)}
                                            />
                                            <Label htmlFor="is_vierify" className="text-sm font-medium">
                                                Verified by Admin
                                            </Label>
                                        </div>

                                        <div className="text-xs text-gray-500 mt-2">
                                            <p>• Active Status: Whether the business is currently operational</p>
                                            <p>• Verified: Admin approval to show on the public website</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Business Image */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Image className="w-5 h-5" />
                                            Business Image
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ImageUpload
                                            label=""
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
                                            placeholder="Upload business image or enter URL"
                                        />
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button type="submit" disabled={processing} className="w-full">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>

                                        <Link href={`/admin/businesses/${business.id}`}>
                                            <Button variant="outline" className="w-full">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}