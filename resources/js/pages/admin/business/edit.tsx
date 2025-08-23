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
import { BusinessEditProps, District, Commune, Village } from '@/types';
import { ArrowLeft, Building, MapPin, Settings } from 'lucide-react';
import axios from 'axios';

export default function BusinessEdit({ auth, business, provinces }: BusinessEditProps) {
    const [districts, setDistricts] = useState<District[]>([]);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    
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
        status: business.status || false,
        is_vierify: business.is_vierify || false,
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
        put(`/admin/businesses/${business.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${business.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/businesses/${business.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Details
                            </Button>
                        </Link>
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
                                        <Building className="w-5 h-5" />
                                        Business Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Business Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Business name"
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
                                            placeholder="Describe the business..."
                                            rows={3}
                                            className={errors.descriptions ? 'border-red-500' : ''}
                                        />
                                        {errors.descriptions && (
                                            <p className="text-sm text-red-500">{errors.descriptions}</p>
                                        )}
                                    </div>

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
        </AppLayout>
    );
}