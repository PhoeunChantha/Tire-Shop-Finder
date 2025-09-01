import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { TimeRangePicker } from '@/components/ui/time-range-picker';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOFields } from '@/components/seo-fields';
import { ImageUpload } from '@/components/ui/image-upload';
import { Province, District, Commune, Village, User } from '@/types';
import { MapPin, Building, Clock, User as UserIcon, Settings, Globe, Image } from 'lucide-react';
import axios from 'axios';

interface AdminBusinessCreateProps {
    auth: any;
    provinces: Province[];
    users: User[];
}

export default function AdminBusinessCreate({ auth, provinces, users }: AdminBusinessCreateProps) {
    const [districts, setDistricts] = useState<District[]>([]);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<'en' | 'km'>('en');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        descriptions: '',
        name_translations: {
            en: '',
            km: ''
        },
        descriptions_translations: {
            en: '',
            km: ''
        },
        created_by: '',
        province_id: '',
        district_id: '',
        commune_id: '',
        village_id: '',
        latitude: '',
        longitude: '',
        opening_time: '',
        closing_time: '',
        status: true,
        is_vierify: true,
        seo_title: '',
        seo_description: '',
        seo_title_translations: {
            en: '',
            km: ''
        },
        seo_description_translations: {
            en: '',
            km: ''
        },
        seo_image: '' as string | File,
        seo_keywords: [] as string[],
        image: null as File | string | null,
    });

    const handleProvinceChange = async (provinceId: string) => {
        setData('province_id', provinceId);
        setData('district_id', '');
        setData('commune_id', '');
        setData('village_id', '');

        setDistricts([]);
        setCommunes([]);
        setVillages([]);

        if (provinceId) {
            setLoadingDistricts(true);
            try {
                const response = await axios.get(`/admin/api/districts/${provinceId}`);
                setDistricts(response.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    const handleDistrictChange = async (districtId: string) => {
        setData('district_id', districtId);
        setData('commune_id', '');
        setData('village_id', '');

        setCommunes([]);
        setVillages([]);

        if (districtId) {
            setLoadingCommunes(true);
            try {
                const response = await axios.get(`/admin/api/communes/${districtId}`);
                setCommunes(response.data);
            } catch (error) {
                console.error('Error fetching communes:', error);
            } finally {
                setLoadingCommunes(false);
            }
        }
    };

    const handleCommuneChange = async (communeId: string) => {
        setData('commune_id', communeId);
        setData('village_id', '');

        setVillages([]);

        if (communeId) {
            setLoadingVillages(true);
            try {
                const response = await axios.get(`/admin/api/villages/${communeId}`);
                setVillages(response.data);
            } catch (error) {
                console.error('Error fetching villages:', error);
            } finally {
                setLoadingVillages(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('businesses.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Business" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Create New Business
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Create a new tire shop business listing for a user.
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Business Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Globe className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">Business Information</h3>
                                </div>



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

                                    <TabsContent value="en" className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name_en">Business Name (English) <span className="text-red-500">*</span></Label>
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
                                        {/* User Selection */}
                                        <div className="space-y-2">
                                            <Label>Select User Business Owner <span className="text-red-500">*</span></Label>
                                            <SearchableSelect
                                                options={users.map(user => ({
                                                    value: user.id.toString(),
                                                    label: `${user.name} (${user.email})`
                                                }))}
                                                value={data.created_by}
                                                onValueChange={(value) => setData('created_by', value)}
                                                placeholder="Select business owner"
                                                searchPlaceholder="Search users..."
                                                emptyMessage="No users found."
                                                className={`max-w-2xl ${errors.created_by ? 'border-red-500' : ''}`}
                                            />
                                            {errors.created_by && (
                                                <p className="text-sm text-red-500">{errors.created_by}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="descriptions_en">Business Description (English)</Label>
                                            <Textarea
                                                id="descriptions_en"
                                                value={data.descriptions_translations.en}
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
                                                value={data.name_translations.km}
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
                                                value={data.descriptions_translations.km}
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

                                {/* Business Image */}
                                <div className="pt-4 border-t">
                                    <ImageUpload
                                        label="Business Image"
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
                                        className="max-w-2xl"
                                        placeholder="Upload business image or enter URL"
                                    />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <MapPin className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">Location</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Province <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            options={provinces.map(province => ({
                                                value: province.id.toString(),
                                                label: province.name
                                            }))}
                                            value={data.province_id}
                                            onValueChange={handleProvinceChange}
                                            placeholder="Select Province"
                                            searchPlaceholder="Search provinces..."
                                            emptyMessage="No provinces found."
                                            className={errors.province_id ? 'border-red-500' : ''}
                                        />
                                        {errors.province_id && (
                                            <p className="text-sm text-red-500">{errors.province_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>District <span className="text-red-500">*</span></Label>
                                        <SearchableSelect
                                            key={`district-${data.province_id}`}
                                            options={districts.map(district => ({
                                                value: district.id.toString(),
                                                label: district.name
                                            }))}
                                            value={data.district_id}
                                            onValueChange={handleDistrictChange}
                                            placeholder="Select District"
                                            searchPlaceholder="Search districts..."
                                            emptyMessage="No districts found."
                                            disabled={!data.province_id}
                                            loading={loadingDistricts}
                                            className={errors.district_id ? 'border-red-500' : ''}
                                        />
                                        {errors.district_id && (
                                            <p className="text-sm text-red-500">{errors.district_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Commune</Label>
                                        <SearchableSelect
                                            key={`commune-${data.district_id}`}
                                            options={communes.map(commune => ({
                                                value: commune.id.toString(),
                                                label: commune.name
                                            }))}
                                            value={data.commune_id}
                                            onValueChange={handleCommuneChange}
                                            placeholder="Select Commune"
                                            searchPlaceholder="Search communes..."
                                            emptyMessage="No communes found."
                                            disabled={!data.district_id}
                                            loading={loadingCommunes}
                                            className={errors.commune_id ? 'border-red-500' : ''}
                                        />
                                        {errors.commune_id && (
                                            <p className="text-sm text-red-500">{errors.commune_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Village</Label>
                                        <SearchableSelect
                                            key={`village-${data.commune_id}`}
                                            options={villages.map(village => ({
                                                value: village.id.toString(),
                                                label: village.name
                                            }))}
                                            value={data.village_id}
                                            onValueChange={(value) => setData('village_id', value)}
                                            placeholder="Select Village"
                                            searchPlaceholder="Search villages..."
                                            emptyMessage="No villages found."
                                            disabled={!data.commune_id}
                                            loading={loadingVillages}
                                            className={errors.village_id ? 'border-red-500' : ''}
                                        />
                                        {errors.village_id && (
                                            <p className="text-sm text-red-500">{errors.village_id}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours & Coordinates */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Clock className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">Business Hours & Coordinates</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="latitude">Latitude <span className="text-red-500">*</span></Label>
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
                                            <Label htmlFor="longitude">Longitude <span className="text-red-500">*</span></Label>
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
                                </div>
                            </div>

                            {/* Admin Settings */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Settings className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">Admin Settings</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Active Status</Label>
                                            <div className="text-sm text-muted-foreground">
                                                Enable or disable the business listing
                                            </div>
                                        </div>
                                        <Switch
                                            checked={data.status}
                                            onCheckedChange={(checked) => setData('status', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Verified Status</Label>
                                            <div className="text-sm text-muted-foreground">
                                                Mark business as verified
                                            </div>
                                        </div>
                                        <Switch
                                            checked={data.is_vierify}
                                            onCheckedChange={(checked) => setData('is_vierify', checked)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEO Fields */}
                            <div className="pt-6 space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Settings className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">SEO Settings</h3>
                                </div>
                                
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
                                                value={data.seo_title_translations.en}
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
                                                {data.seo_title_translations.en.length}/60 characters
                                                {data.seo_title_translations.en.length > 60 && (
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
                                                value={data.seo_description_translations.en}
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
                                                {data.seo_description_translations.en.length}/160 characters
                                                {data.seo_description_translations.en.length > 160 && (
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
                                                value={data.seo_title_translations.km}
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
                                                {data.seo_title_translations.km.length}/60 តួអក្សរ
                                            </div>
                                            {errors['seo_title_translations.km'] && (
                                                <p className="text-sm text-red-500">{errors['seo_title_translations.km']}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="seo_description_km">ការពិពណ៌នា SEO (ខ្មែរ)</Label>
                                            <Textarea
                                                id="seo_description_km"
                                                value={data.seo_description_translations.km}
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
                                                {data.seo_description_translations.km.length}/160 តួអក្សរ
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
                                            <Label htmlFor="seo_image">SEO Image</Label>
                                            <Input
                                                id="seo_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setData('seo_image', file);
                                                    }
                                                }}
                                                className={`max-w-md ${errors.seo_image ? 'border-red-500' : ''}`}
                                            />
                                            {errors.seo_image && (
                                                <p className="text-sm text-red-500">{errors.seo_image}</p>
                                            )}
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
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <a href={route('businesses.index')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </a>
                                <Button type="submit" disabled={processing} size="lg">
                                    {processing ? 'Creating...' : 'Create Business'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}