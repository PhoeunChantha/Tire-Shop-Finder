import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { TimeRangePicker } from '@/components/ui/time-range-picker';
import { Business, Province, District, Commune, Village } from '@/types';
import { MapPin, Building, Clock, ArrowLeft } from 'lucide-react';
import { SEOFields } from '@/components/seo-fields';
import axios from 'axios';

interface BusinessEditProps {
    auth: any;
    business: Business;
    provinces: Province[];
}

export default function EditBusiness({ auth, business, provinces }: BusinessEditProps) {
    const [districts, setDistricts] = useState<District[]>([]);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        name: business.name || '',
        descriptions: business.descriptions || '',
        province_id: business.province_id?.toString() || '',
        district_id: business.district_id?.toString() || '',
        commune_id: business.commune_id?.toString() || '',
        village_id: business.village_id?.toString() || '',
        latitude: business.latitude || '',
        longitude: business.longitude || '',
        opening_time: business.opening_time || '',
        closing_time: business.closing_time || '',
        seo_title: business.seo_title || '',
        seo_description: business.seo_description || '',
        seo_image: business.seo_image || '',
        seo_keywords: business.seo_keywords || [],
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
            setLoadingDistricts(true);
            try {
                const response = await axios.get(`/api/districts/${provinceId}`);
                setDistricts(response.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    const loadCommunes = async (districtId: string) => {
        if (districtId) {
            setLoadingCommunes(true);
            try {
                const response = await axios.get(`/api/communes/${districtId}`);
                setCommunes(response.data);
            } catch (error) {
                console.error('Error fetching communes:', error);
            } finally {
                setLoadingCommunes(false);
            }
        }
    };

    const loadVillages = async (communeId: string) => {
        if (communeId) {
            setLoadingVillages(true);
            try {
                const response = await axios.get(`/api/villages/${communeId}`);
                setVillages(response.data);
            } catch (error) {
                console.error('Error fetching villages:', error);
            } finally {
                setLoadingVillages(false);
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

        if (provinceId) {
            await loadDistricts(provinceId);
        }
    };

    const handleDistrictChange = async (districtId: string) => {
        setData('district_id', districtId);
        setData('commune_id', '');
        setData('village_id', '');
        
        setCommunes([]);
        setVillages([]);

        if (districtId) {
            await loadCommunes(districtId);
        }
    };

    const handleCommuneChange = async (communeId: string) => {
        setData('commune_id', communeId);
        setData('village_id', '');
        
        setVillages([]);

        if (communeId) {
            await loadVillages(communeId);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/businesses/${business.id}`);
    };

    return (
        <WebsiteLayout>
            <Head title={`Edit ${business.name}`} />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <a
                            href="/user-dashboard"
                            className="inline-flex items-center text-gray-600 hover:text-gray-700 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </a>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Edit Your Tire Shop
                            </h1>
                            <p className="text-lg text-gray-600">
                                Update your business information to keep customers informed.
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Business Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Phnom Penh Tire Center"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descriptions">Business Description</Label>
                                    <Textarea
                                        id="descriptions"
                                        value={data.descriptions}
                                        onChange={(e) => setData('descriptions', e.target.value)}
                                        placeholder="Tell customers about your tire shop, services, and specialties..."
                                        rows={3}
                                        className={errors.descriptions ? 'border-red-500' : ''}
                                    />
                                    {errors.descriptions && (
                                        <p className="text-sm text-red-500">{errors.descriptions}</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
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

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Business Hours & Location</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Business Hours <span className="text-red-500">*</span></Label>
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

                                {/* SEO Fields */}
                                <div className="pt-6">
                                    <SEOFields
                                        seoTitle={data.seo_title}
                                        seoDescription={data.seo_description}
                                        seoImage={data.seo_image}
                                        seoKeywords={data.seo_keywords}
                                        onSeoTitleChange={(value) => setData('seo_title', value)}
                                        onSeoDescriptionChange={(value) => setData('seo_description', value)}
                                        onSeoImageChange={(value) => setData('seo_image', value)}
                                        onSeoKeywordsChange={(keywords) => setData('seo_keywords', keywords)}
                                        errors={errors}
                                    />
                                </div>

                                <div className="flex justify-between space-x-4 pt-4">
                                    <a href="/user-dashboard">
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </a>
                                    <Button type="submit" disabled={processing} size="lg">
                                        {processing ? 'Updating...' : 'Update Business'}
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