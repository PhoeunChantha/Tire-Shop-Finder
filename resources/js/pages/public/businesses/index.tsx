import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Business, Province, District, Commune, Village, PaginatedData } from '@/types';
import { 
    Search, 
    MapPin, 
    Clock, 
    Phone, 
    Star, 
    Wrench, 
    Filter,
    ChevronRight,
    Navigation,
    MapPin as LocationIcon
} from 'lucide-react';

interface BusinessIndexProps {
    businesses: PaginatedData<Business>;
    provinces: Province[];
    districts: District[];
    filters: {
        search?: string;
        province_id?: string;
        district_id?: string;
        commune_id?: string;
        village_id?: string;
        service?: string;
    };
}

export default function PublicBusinessIndex({ 
    businesses, 
    provinces, 
    districts: initialDistricts, 
    filters 
}: BusinessIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedProvince, setSelectedProvince] = useState(filters.province_id || '');
    const [selectedDistrict, setSelectedDistrict] = useState(filters.district_id || '');
    const [selectedCommune, setSelectedCommune] = useState(filters.commune_id || '');
    const [selectedVillage, setSelectedVillage] = useState(filters.village_id || '');
    const [serviceFilter, setServiceFilter] = useState(filters.service || '');
    const [districts, setDistricts] = useState<District[]>(initialDistricts || []);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Load districts when province changes
    useEffect(() => {
        if (selectedProvince) {
            setLoadingDistricts(true);
            axios.get(`/api/public/districts/${selectedProvince}`)
                .then(response => {
                    setDistricts(response.data);
                })
                .catch(error => {
                    console.error('Error loading districts:', error);
                })
                .finally(() => {
                    setLoadingDistricts(false);
                });
        } else {
            setDistricts([]);
            setSelectedDistrict('');
            setCommunes([]);
            setSelectedCommune('');
            setVillages([]);
            setSelectedVillage('');
        }
    }, [selectedProvince]);

    // Load communes when district changes
    useEffect(() => {
        if (selectedDistrict) {
            setLoadingCommunes(true);
            axios.get(`/api/public/communes/${selectedDistrict}`)
                .then(response => {
                    setCommunes(response.data);
                })
                .catch(error => {
                    console.error('Error loading communes:', error);
                })
                .finally(() => {
                    setLoadingCommunes(false);
                });
        } else {
            setCommunes([]);
            setSelectedCommune('');
            setVillages([]);
            setSelectedVillage('');
        }
    }, [selectedDistrict]);

    // Load villages when commune changes
    useEffect(() => {
        if (selectedCommune) {
            setLoadingVillages(true);
            axios.get(`/api/public/villages/${selectedCommune}`)
                .then(response => {
                    setVillages(response.data);
                })
                .catch(error => {
                    console.error('Error loading villages:', error);
                })
                .finally(() => {
                    setLoadingVillages(false);
                });
        } else {
            setVillages([]);
            setSelectedVillage('');
        }
    }, [selectedCommune]);

    // Get current location and auto-select dropdowns
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser');
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Call reverse geocoding API
                    const response = await axios.post('/api/public/reverse-geocode', {
                        latitude,
                        longitude
                    });

                    const { province_id, district_id, commune_id, village_id } = response.data;
                    
                    // Auto-select the location dropdowns
                    if (province_id) {
                        setSelectedProvince(province_id.toString());
                    }
                    if (district_id) {
                        setSelectedDistrict(district_id.toString());
                    }
                    if (commune_id) {
                        setSelectedCommune(commune_id.toString());
                    }
                    if (village_id) {
                        setSelectedVillage(village_id.toString());
                    }
                } catch (error) {
                    console.error('Error getting location data:', error);
                    alert('Unable to determine your location address');
                } finally {
                    setGettingLocation(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setGettingLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('Location access denied by user');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Location information is unavailable');
                        break;
                    case error.TIMEOUT:
                        alert('Location request timed out');
                        break;
                    default:
                        alert('An unknown error occurred while getting location');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const handleSearch = () => {
        // Close mobile filters after search
        setShowFilters(false);
        
        router.get('/tire-shops', {
            search: searchTerm,
            province_id: selectedProvince,
            district_id: selectedDistrict,
            commune_id: selectedCommune,
            village_id: selectedVillage,
            service: serviceFilter,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedCommune('');
        setSelectedVillage('');
        setServiceFilter('');
        setDistricts([]);
        setCommunes([]);
        setVillages([]);
        router.get('/tire-shops');
    };

    const getDistanceText = (business: Business) => {
        if (business.province?.name && business.district?.name) {
            return `${business.district.name}, ${business.province.name}`;
        }
        return 'Location not specified';
    };

    return (
        <WebsiteLayout>
            <Head title="Find Tire Shops Near You" />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Find Tire Shops Near You
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Quick, reliable tire services when you need them most
                        </p>
                        
                        {/* Quick Search */}
                        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search tire shops..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 text-gray-900"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <Button onClick={handleSearch} size="lg" className="px-8 shrink-0">
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="w-full mb-4"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>

                    {/* Sidebar Filters */}
                    <div className={`w-full lg:w-80 lg:shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg shadow-sm border p-6 lg:sticky lg:top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Results</h3>
                            
                            {/* Location Button */}
                            <div className="mb-6">
                                <Button 
                                    onClick={getCurrentLocation} 
                                    variant="outline"
                                    disabled={gettingLocation}
                                    className="w-full text-gray-900"
                                >
                                    <LocationIcon className="w-4 h-4 mr-2" />
                                    {gettingLocation ? 'Getting Location...' : 'Use My Location'}
                                </Button>
                            </div>

                            {/* Location Dropdowns */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Province</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: 'All Provinces' },
                                            ...provinces.map(province => ({
                                                value: province.id.toString(),
                                                label: province.name
                                            }))
                                        ]}
                                        value={selectedProvince}
                                        onValueChange={(value) => {
                                            console.log('Province selected:', value);
                                            setSelectedProvince(value);
                                            setSelectedDistrict(''); 
                                            setSelectedCommune('');
                                            setSelectedVillage('');
                                        }}
                                        placeholder="Select Province"
                                        className="text-gray-900"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: 'All Districts' },
                                            ...districts.map(district => ({
                                                value: district.id.toString(),
                                                label: district.name
                                            }))
                                        ]}
                                        value={selectedDistrict}
                                        onValueChange={(value) => {
                                            console.log('District selected:', value);
                                            setSelectedDistrict(value);
                                            setSelectedCommune('');
                                            setSelectedVillage('');
                                        }}
                                        placeholder={loadingDistricts ? "Loading districts..." : "Select District"}
                                        loading={loadingDistricts}
                                        disabled={loadingDistricts || !selectedProvince}
                                        className="text-gray-900"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Commune</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: 'All Communes' },
                                            ...communes.map(commune => ({
                                                value: commune.id.toString(),
                                                label: commune.name
                                            }))
                                        ]}
                                        value={selectedCommune}
                                        onValueChange={(value) => {
                                            console.log('Commune selected:', value);
                                            setSelectedCommune(value);
                                            setSelectedVillage('');
                                        }}
                                        placeholder={loadingCommunes ? "Loading communes..." : "Select Commune"}
                                        loading={loadingCommunes}
                                        disabled={loadingCommunes || !selectedDistrict}
                                        className="text-gray-900"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Village</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: 'All Villages' },
                                            ...villages.map(village => ({
                                                value: village.id.toString(),
                                                label: village.name
                                            }))
                                        ]}
                                        value={selectedVillage}
                                        onValueChange={(value) => {
                                            console.log('Village selected:', value);
                                            setSelectedVillage(value);
                                        }}
                                        placeholder={loadingVillages ? "Loading villages..." : "Select Village"}
                                        loading={loadingVillages}
                                        disabled={loadingVillages || !selectedCommune}
                                        className="text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
                                <Input
                                    placeholder="e.g., emergency, installation..."
                                    value={serviceFilter}
                                    onChange={(e) => setServiceFilter(e.target.value)}
                                    className="text-gray-900"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button onClick={handleSearch} className="w-full">
                                    <Search className="w-4 h-4 mr-2" />
                                    Apply Filters
                                </Button>
                                
                                {(searchTerm || selectedProvince || selectedDistrict || selectedCommune || selectedVillage || serviceFilter) && (
                                    <Button variant="outline" onClick={clearFilters} className="w-full">
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Results */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Available Tire Shops
                                </h2>
                                <p className="text-gray-600">
                                    Found {businesses.total} tire shops ready to help
                                </p>
                            </div>
                        </div>

                {/* Business Grid */}
                {businesses.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {businesses.data.map((business) => (
                            <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <Link href={`/tire-shops/${business.id}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {business.name}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {getDistanceText(business)}
                                                </div>
                                                {business.formatted_hours && (
                                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {business.formatted_hours}
                                                    </div>
                                                )}
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">
                                                Verified
                                            </Badge>
                                        </div>

                                        {business.descriptions && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {business.descriptions}
                                            </p>
                                        )}

                                        {business.services && business.services.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Wrench className="w-4 h-4 text-orange-600" />
                                                    <span className="text-sm font-medium">Services:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {business.services.slice(0, 3).map((service) => (
                                                        <Badge 
                                                            key={service.id} 
                                                            variant="outline" 
                                                            className="text-xs"
                                                        >
                                                            {service.name}
                                                        </Badge>
                                                    ))}
                                                    {business.services.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{business.services.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-yellow-500">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} className="w-4 h-4 fill-current" />
                                                ))}
                                                <span className="text-gray-600 text-sm ml-1">(0 reviews)</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No tire shops found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search criteria or location filters.
                        </p>
                        <Button onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                )}

                        {/* Pagination */}
                        {businesses.last_page > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-2">
                                    {businesses.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WebsiteLayout>
    );
}