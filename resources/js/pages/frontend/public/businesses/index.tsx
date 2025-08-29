import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SEOHead } from '@/components/seo-head';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Business, Province, District, Commune, Village, PaginatedData } from '@/types';
import { parseGoogleMapsUrl, validateCambodiaCoordinates, formatCoordinates } from '@/lib/maps-utils';
import { 
    Search, 
    MapPin, 
    Clock, 
    Star, 
    Wrench, 
    Filter,
    ChevronRight,
    Navigation,
    MapPin as LocationIcon,
    Link as LinkIcon
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
    userLocation?: {
        lat?: number;
        lng?: number;
    };
}

export default function PublicBusinessIndex({ 
    businesses, 
    provinces, 
    districts: initialDistricts, 
    filters,
    userLocation 
}: BusinessIndexProps) {
    const { t } = useTranslation();
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
    const [userCoords, setUserCoords] = useState<{lat: number, lng: number, accuracy?: number} | null>(
        userLocation?.lat && userLocation?.lng ? 
        { lat: userLocation.lat, lng: userLocation.lng } : null
    );
    const [mapsUrl, setMapsUrl] = useState('');
    const [parsingUrl, setParsingUrl] = useState(false);
    const [urlError, setUrlError] = useState('');

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

    // Get high-accuracy current location like mobile Maps apps
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            Notiflix.Notify.failure('GPS location services are not available on this device');
            return;
        }

        setGettingLocation(true);
        
        let bestPosition: GeolocationPosition | null = null;
        let bestAccuracy = Infinity;
        const startTime = Date.now();
        
        // Use watchPosition for multiple GPS readings to get the best accuracy
        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                try {
                    const { accuracy } = position.coords;
                    
                    console.log(`GPS reading: ${accuracy.toFixed(1)}m accuracy`);
                    
                    // Keep track of the best (most accurate) position
                    if (accuracy < bestAccuracy) {
                        bestAccuracy = accuracy;
                        bestPosition = position;
                    }
                    
                    // If we get good accuracy (< 100m) or have been trying for 20 seconds, use best position
                    const shouldStop = accuracy < 100 || 
                                      bestAccuracy < 200 || 
                                      (Date.now() - startTime) > 20000;
                    
                    if (shouldStop && bestPosition) {
                        navigator.geolocation.clearWatch(watchId);
                        
                        const finalAccuracy = bestPosition.coords.accuracy;
                        console.log(`Using position with ${finalAccuracy.toFixed(1)}m accuracy`);
                        
                        const processLocation = async () => {
                            // Call reverse geocoding API with best coordinates
                            const response = await axios.post('/api/public/reverse-geocode', {
                                latitude: bestPosition.coords.latitude,
                                longitude: bestPosition.coords.longitude,
                                accuracy: finalAccuracy
                            });

                            const { province_id, district_id, commune_id, village_id } = response.data;
                            
                            // Store best coordinates with accuracy
                            setUserCoords({ 
                                lat: bestPosition.coords.latitude, 
                                lng: bestPosition.coords.longitude, 
                                accuracy: finalAccuracy 
                            });

                            // Auto-select the location dropdowns (optional - user can still override)
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

                            // Automatically show nearby businesses
                            setTimeout(() => {
                                if (bestPosition) {
                                    searchWithLocation(bestPosition.coords.latitude, bestPosition.coords.longitude);
                                }
                            }, 300);
                            
                            setGettingLocation(false);
                        };
                        
                        // Warn user if accuracy is still poor
                        if (finalAccuracy > 1000) {
                            Notiflix.Confirm.show(
                                'Low GPS Accuracy',
                                `Location accuracy is low (${(finalAccuracy/1000).toFixed(1)}km). This might show distant results. Continue anyway?`,
                                'Yes, Continue',
                                'Cancel',
                                function okCb() {
                                    processLocation();
                                },
                                function cancelCb() {
                                    setGettingLocation(false);
                                    return;
                                }
                            );
                        } else {
                            processLocation();
                        }
                    }
                } catch (error) {
                    navigator.geolocation.clearWatch(watchId);
                    console.error('Error processing location:', error);
                    Notiflix.Notify.failure('Unable to find tire shops near your location. Please try manual search.');
                    setGettingLocation(false);
                }
            },
            (error) => {
                navigator.geolocation.clearWatch(watchId);
                console.error('GPS error:', error);
                setGettingLocation(false);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        Notiflix.Notify.failure('Location permission denied. Please enable location services and allow GPS access.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        Notiflix.Notify.failure('GPS signal not available. Please ensure location services are enabled and try outdoors.');
                        break;
                    case error.TIMEOUT:
                        Notiflix.Notify.failure('GPS timeout. Please check your location settings or try again outdoors.');
                        break;
                    default:
                        Notiflix.Notify.failure('Unable to get your GPS location. Please try manual search.');
                        break;
                }
            },
            {
                enableHighAccuracy: true,    // Force GPS usage
                timeout: 30000,              // Wait up to 30 seconds for GPS fix
                maximumAge: 0                // Always get fresh location
            }
        );
        
        // Fallback: stop after 25 seconds and use best position found
        setTimeout(() => {
            if (watchId && gettingLocation) {
                navigator.geolocation.clearWatch(watchId);
                
                if (bestPosition && bestAccuracy < 5000) { // Accept if less than 5km accuracy
                    // Use the best position we found
                    console.log(`Timeout reached, using best position: ${bestAccuracy.toFixed(1)}m`);
                    // Process the best position we have
                } else {
                    setGettingLocation(false);
                    Notiflix.Notify.failure('Could not get accurate GPS location. Please try again outdoors or use manual search.');
                }
            }
        }, 25000);
    };

    const handleMapsUrlSubmit = async () => {
        if (!mapsUrl.trim()) {
            setUrlError('Please enter a Google Maps link');
            return;
        }

        setParsingUrl(true);
        setUrlError('');
        
        try {
            const coords = await parseGoogleMapsUrl(mapsUrl.trim());
            
            if (!coords) {
                setUrlError('Could not extract coordinates from this link. Please try a different Google Maps link.');
                setParsingUrl(false);
                return;
            }
            
            console.log('Parsed coordinates:', formatCoordinates(coords));
            
            // Call reverse geocoding API with parsed coordinates
            const response = await axios.post('/api/public/reverse-geocode', {
                latitude: coords.lat,
                longitude: coords.lng,
                accuracy: 50
            });

            const { province_id, district_id, commune_id, village_id } = response.data;
            
            // Store coordinates
            setUserCoords({ 
                lat: coords.lat, 
                lng: coords.lng, 
                accuracy: 50
            });

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

            // Clear the URL input and show success
            setMapsUrl('');
            
            // Automatically show nearby businesses
            setTimeout(() => {
                searchWithLocation(coords.lat, coords.lng);
            }, 300);
            
        } catch (error) {
            console.error('Error processing Google Maps URL:', error);
            
            // Try to extract error message from the response
            let errorMessage = 'Error processing the link. Please try again or use GPS location instead.';
            
            if (error instanceof Error) {
                errorMessage = error.message;
                
                // Try to parse JSON error response for more details
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.debug_info) {
                        console.log('Debug info:', errorData.debug_info);
                        if (errorData.debug_info.expanded_url) {
                            console.log('Expanded URL was:', errorData.debug_info.expanded_url);
                        }
                        if (errorData.debug_info.patterns_tested) {
                            console.log('Pattern test results:', errorData.debug_info.patterns_tested);
                        }
                    }
                } catch {
                    // Not JSON, use the error message as-is
                }
            }
            
            setUrlError(errorMessage);
        }
        
        setParsingUrl(false);
    };

    const searchWithLocation = (lat?: number, lng?: number) => {
        const coords = { lat: lat || userCoords?.lat, lng: lng || userCoords?.lng };
        
        router.get('/tire-shops', {
            search: searchTerm,
            province_id: selectedProvince,
            district_id: selectedDistrict,
            commune_id: selectedCommune,
            village_id: selectedVillage,
            service: serviceFilter,
            user_lat: coords.lat,
            user_lng: coords.lng,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSearch = () => {
        // Close mobile filters after search
        setShowFilters(false);
        
        // Use location-based search if coordinates are available
        if (userCoords) {
            searchWithLocation();
        } else {
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
        }
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
        setMapsUrl('');
        setUrlError('');
        setUserCoords(null);
        router.get('/tire-shops');
    };

    const getDistanceText = (business: Business) => {
        // Show distance if available and user has location
        if (business.distance !== undefined && userCoords) {
            const distance = parseFloat(business.distance);
            if (distance < 1) {
                return `${(distance * 1000).toFixed(0)}m away`;
            } else {
                return `${distance.toFixed(1)}km away`;
            }
        }
        
        // Fallback to location names
        if (business.province?.name && business.district?.name) {
            return `${business.district.name}, ${business.province.name}`;
        }
        return 'Location not specified';
    };

    const getLocationName = () => {
        const parts = [];
        if (selectedVillage && villages.length > 0) {
            const village = villages.find(v => v.id.toString() === selectedVillage);
            if (village) parts.push(village.name);
        }
        if (selectedCommune && communes.length > 0) {
            const commune = communes.find(c => c.id.toString() === selectedCommune);
            if (commune) parts.push(commune.name);
        }
        if (selectedDistrict && districts.length > 0) {
            const district = districts.find(d => d.id.toString() === selectedDistrict);
            if (district) parts.push(district.name);
        }
        if (selectedProvince) {
            const province = provinces.find(p => p.id.toString() === selectedProvince);
            if (province) parts.push(province.name);
        }
        return parts.length > 0 ? parts.join(', ') : 'Cambodia';
    };

    const getSEOTitle = () => {
        const location = getLocationName();
        if (searchTerm) {
            return `${searchTerm} Tire Shops in ${location}`;
        }
        if (userCoords) {
            return `Nearest Tire Shops - Find Tire Services Near You`;
        }
        return location !== 'Cambodia' ? `Tire Shops in ${location}` : 'Find Tire Shops in Cambodia';
    };

    const getSEODescription = () => {
        const location = getLocationName();
        const count = businesses.total;
        if (userCoords) {
            return `Find the nearest tire shops and services near your location. ${count} verified tire shops in Cambodia with professional installation, repair, and replacement services.`;
        }
        if (searchTerm) {
            return `Search results for "${searchTerm}" tire services in ${location}. ${count} professional tire shops offering quality services and competitive prices.`;
        }
        return `Discover ${count} verified tire shops in ${location}. Professional tire installation, repair, balancing, and replacement services across Cambodia.`;
    };

    const getSEOKeywords = () => {
        const keywords = ['tire shops', 'tire services', 'tire installation', 'tire repair', 'Cambodia'];
        const location = getLocationName();
        if (location !== 'Cambodia') {
            keywords.push(location);
        }
        if (searchTerm) {
            keywords.push(searchTerm);
        }
        if (userCoords) {
            keywords.push('nearest tire shop', 'tire shop near me');
        }
        return keywords;
    };

    return (
        <WebsiteLayout>
            <SEOHead
                title={getSEOTitle()}
                description={getSEODescription()}
                keywords={getSEOKeywords()}
                type="website"
                url={typeof window !== 'undefined' ? window.location.href : undefined}
            />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('find_tire_shops')}
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
                                        placeholder={t('search_tire_shops')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 text-gray-900"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <Button onClick={handleSearch} size="lg" className="px-8 shrink-0">
                                    <Search className="w-4 h-4 mr-2" />
                                    {t('search')}
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
                                    variant={userCoords ? "default" : "outline"}
                                    disabled={gettingLocation}
                                    className={`w-full transition-all duration-200 ${
                                        userCoords ? 'bg-green-600 hover:bg-green-700 text-white' : 
                                        gettingLocation ? 'text-blue-600 border-blue-400' : 'text-gray-900'
                                    }`}
                                >
                                    {gettingLocation ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                                            Getting precise location...
                                        </>
                                    ) : userCoords ? (
                                        <>
                                            <LocationIcon className="w-4 h-4 mr-2" />
                                            Location Found ✓
                                        </>
                                    ) : (
                                        <>
                                            <LocationIcon className="w-4 h-4 mr-2" />
                                            {t('use_my_location')}
                                        </>
                                    )}
                                </Button>
                                {userCoords && (
                                    <div className="mt-2 text-center">
                                        <p className="text-sm text-green-600">
                                            📍 Showing results near your location
                                        </p>
                                        {userCoords.accuracy && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                GPS accuracy: {userCoords.accuracy < 10 ? 'Very precise' : 
                                                             userCoords.accuracy < 100 ? 'Good' : 
                                                             userCoords.accuracy < 1000 ? 'Fair' : 'Poor'} 
                                                ({userCoords.accuracy > 1000 ? 
                                                  `${(userCoords.accuracy/1000).toFixed(1)}km` : 
                                                  `${userCoords.accuracy.toFixed(0)}m`})
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Google Maps URL Input */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <LinkIcon className="w-4 h-4 text-blue-600" />
                                    <label className="text-sm font-medium text-blue-900">
                                        Share Google Maps Location
                                    </label>
                                </div>
                                <p className="text-xs text-blue-700 mb-3">
                                    Paste a Google Maps link to find tire shops near that location
                                </p>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="https://maps.app.goo.gl/..."
                                        value={mapsUrl}
                                        onChange={(e) => {
                                            setMapsUrl(e.target.value);
                                            if (urlError) setUrlError('');
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleMapsUrlSubmit()}
                                        className="text-gray-900 text-sm"
                                        disabled={parsingUrl}
                                    />
                                    {urlError && (
                                        <p className="text-xs text-red-600">{urlError}</p>
                                    )}
                                    <Button 
                                        onClick={handleMapsUrlSubmit}
                                        disabled={parsingUrl || !mapsUrl.trim()}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
                                    >
                                        {parsingUrl ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2"></div>
                                                Processing link...
                                            </>
                                        ) : (
                                            <>
                                                <LinkIcon className="w-3 h-3 mr-2" />
                                                Use This Location
                                            </>
                                        )}
                                    </Button>
                                </div>
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
                                    {userCoords ? 'Nearest Tire Shops' : 'Available Tire Shops'}
                                </h2>
                                <p className="text-gray-600">
                                    {userCoords ? 
                                        `Found ${businesses.total} tire shops sorted by distance` :
                                        `Found ${businesses.total} tire shops ready to help`
                                    }
                                </p>
                                {userCoords && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">
                                            Showing results near your location
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                {/* Business Grid */}
                {businesses.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {businesses.data.map((business) => (
                            <Card key={business.id} className="hover:shadow-lg transition-shadow py-0 cursor-pointer overflow-hidden">
                                <Link href={`/tire-shops/${business.slug}`}>
                                    {/* Business Image */}
                                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                                        {business.image ? (
                                            <img 
                                                src={business.image} 
                                                alt={business.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    img.style.display = 'none';
                                                    const parent = img.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><div class="text-center"><div class="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center"><svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><p class="text-sm text-gray-500">No image</p></div></div>';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm text-gray-500">No image</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Distance Badge overlay */}
                                        {business.distance !== undefined && userCoords && (
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-green-600 text-white shadow-lg">
                                                    {(() => {
                                                        const distance = parseFloat(business.distance);
                                                        if (distance < 1) {
                                                            return `${(distance * 1000).toFixed(0)}m away`;
                                                        } else {
                                                            return `${distance.toFixed(1)}km away`;
                                                        }
                                                    })()}
                                                </Badge>
                                            </div>
                                        )}
                                        {/* Verified Badge overlay */}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-green-100 text-green-800 shadow-lg">
                                                Verified
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <CardContent className="p-6">
                                        <div className="mb-4">
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