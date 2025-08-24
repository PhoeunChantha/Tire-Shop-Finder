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
import { BusinessCreateProps, Province, District, Commune, Village } from '@/types';
import { MapPin, Building, Clock } from 'lucide-react';
import axios from 'axios';

export default function CreateBusiness({ auth, provinces }: BusinessCreateProps) {
    const [districts, setDistricts] = useState<District[]>([]);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        descriptions: '',
        province_id: '',
        district_id: '',
        commune_id: '',
        village_id: '',
        latitude: '',
        longitude: '',
        opening_time: '',
        closing_time: '',
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
                const response = await axios.get(`/api/districts/${provinceId}`);
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
                const response = await axios.get(`/api/communes/${districtId}`);
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
                const response = await axios.get(`/api/villages/${communeId}`);
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
        post('/create-business');
    };

    return (
        <WebsiteLayout>
            <Head title="Create Your Tire Shop" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Register Your Tire Shop
                        </h1>
                        <p className="text-lg text-gray-600">
                            Welcome, {auth.user.name}! Let's get your tire shop listed on our platform.
                        </p>
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

                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button type="submit" disabled={processing} size="lg">
                                        {processing ? 'Creating...' : 'Create Business'}
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