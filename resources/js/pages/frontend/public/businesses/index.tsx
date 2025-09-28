import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SEOHead } from '@/components/seo-head';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { BannerCarousel } from '@/components/BannerCarousel';
import { Business, Province, District, Commune, Village, PaginatedData } from '@/types';
import { parseGoogleMapsUrl, formatCoordinates } from '@/lib/maps-utils';
import { toast } from '@/lib/toast';
import { 
    Search, 
    MapPin, 
    Clock, 
    Star, 
    Filter,
    ChevronRight,
    Navigation,
    MapPin as LocationIcon,
    Link as LinkIcon,
    X,
    Loader2,
    Phone,
    Globe,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface Banner {
    id: number;
    title: string;
    descriptions: string;
    image: string | null;
    url: string | null;
    sort_order: number;
}

interface BusinessIndexProps {
    businesses: PaginatedData<Business>;
    provinces: Province[];
    districts: District[];
    banners: Banner[];
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
    banners,
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
    const [searchLoading, setSearchLoading] = useState(false);

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
            toast.error('GPS location services are not available on this device');
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
                        
                        const finalAccuracy = bestPosition?.coords.accuracy || 0;
                        console.log(`Using position with ${finalAccuracy.toFixed(1)}m accuracy`);
                        
                        const processLocation = async () => {
                            // Call reverse geocoding API with best coordinates
                            const response = await axios.post('/api/public/reverse-geocode', {
                                latitude: bestPosition?.coords.latitude,
                                longitude: bestPosition?.coords.longitude,
                                accuracy: finalAccuracy
                            });

                            const { province_id, district_id, commune_id, village_id } = response.data;
                            
                            // Store best coordinates with accuracy
                            setUserCoords({ 
                                lat: bestPosition?.coords.latitude || 0, 
                                lng: bestPosition?.coords.longitude || 0, 
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
                                if (bestPosition?.coords) {
                                    searchWithLocation(bestPosition.coords.latitude, bestPosition.coords.longitude);
                                }
                            }, 300);
                            
                            setGettingLocation(false);
                        };
                        
                        // Warn user if accuracy is still poor
                        if (finalAccuracy > 1000) {
                            toast.warning(`Location accuracy is low (${(finalAccuracy/1000).toFixed(1)}km). Results might be distant.`);
                            processLocation();
                        } else {
                            processLocation();
                        }
                    }
                } catch (error) {
                    navigator.geolocation.clearWatch(watchId);
                    console.error('Error processing location:', error);
                    toast.error('Unable to find tire shops near your location. Please try manual search.');
                    setGettingLocation(false);
                }
            },
            (error) => {
                navigator.geolocation.clearWatch(watchId);
                console.error('GPS error:', error);
                setGettingLocation(false);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Location permission denied. Please enable location services and allow GPS access.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error('GPS signal not available. Please ensure location services are enabled and try outdoors.');
                        break;
                    case error.TIMEOUT:
                        toast.error('GPS timeout. Please check your location settings or try again outdoors.');
                        break;
                    default:
                        toast.error('Unable to get your GPS location. Please try manual search.');
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
                    toast.error('Could not get accurate GPS location. Please try again outdoors or use manual search.');
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
        setSearchLoading(true);
        
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
            replace: true,
            onFinish: () => setSearchLoading(false)
        });
    };

    const handleSearch = () => {
        // Close mobile filters after search
        setShowFilters(false);
        setSearchLoading(true);
        
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
                replace: true,
                onFinish: () => setSearchLoading(false)
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
            const distance = parseFloat(String(business.distance));
            if (distance < 1) {
                return t('distance_away', { distance: `${(distance * 1000).toFixed(0)}m` });
            } else {
                return t('distance_away', { distance: `${distance.toFixed(1)}km` });
            }
        }
        
        // Fallback to location names
        if (business.province?.name && business.district?.name) {
            return `${business.district.name}, ${business.province.name}`;
        }
        return t('location_not_specified');
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

    const renderStars = (rating: number) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <Star 
                key={star} 
                className={`w-4 h-4 ${
                    star <= rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                }`} 
            />
        ));
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
            
            {/* Hero Section - Clean & Professional */}
            <div className="relative text-white overflow-hidden">
                {/* Banner Background or Clean Gradient Background */}
                {banners && banners.length > 0 ? (
                    <div className="absolute inset-0">
                        <BannerCarousel banners={banners} className="h-full" backgroundOnly={true} />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/80" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                )}
                
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
                
                <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20">
                    <div className="text-center">
                        {/* Professional Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            {t('cambodia_tire_directory')}
                        </div>
                        
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-white">{t('find_tire_shops_near_you')}</span>
                        </h1>
                        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                            {t('discover_verified_professionals')}
                        </p>
                        
                        {/* Professional Search Bar */}
                        <div className="max-w-4xl mx-auto mb-8">
                            <div className="bg-white p-3 rounded-2xl shadow-2xl">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            placeholder={t('search_placeholder_detailed')}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 pr-4 py-4 text-gray-900 border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base h-14 rounded-xl transition-all"
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={getCurrentLocation}
                                            disabled={gettingLocation}
                                            className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold h-14 transition-all duration-200 hover:scale-105"
                                        >
                                            {gettingLocation ? (
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            ) : (
                                                <LocationIcon className="w-5 h-5 mr-2" />
                                            )}
                                            {t('near_me')}
                                        </Button>
                                        <Button
                                            onClick={handleSearch}
                                            disabled={searchLoading}
                                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold h-14 transition-all duration-200 hover:scale-105"
                                        >
                                            {searchLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    {t('searching')}
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="w-5 h-5 mr-2" />
                                                    {t('search')}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Clean Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">{businesses.total}+</div>
                                <div className="text-white/60 text-sm font-medium">{t('verified_shops')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                                <div className="text-white/60 text-sm font-medium">{t('emergency_service')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">⭐ 4.8</div>
                                <div className="text-white/60 text-sm font-medium">{t('average_rating')}</div>
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
                        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 -mx-4 px-4 py-4 mb-6">
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                variant={showFilters ? "default" : "outline"}
                                className="w-full transition-all duration-300 transform active:scale-95"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                <span className="flex-1 text-left">
                                    {showFilters ? t('hide_filters') : t('show_filters')}
                                </span>
                                {showFilters ? (
                                    <ChevronUp className="w-4 h-4 ml-2" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar Filters - Clean Design */}
                    <div className={`w-full lg:w-80 lg:shrink-0 transition-all duration-300 ease-in-out ${
                        showFilters 
                            ? 'block opacity-100 translate-y-0' 
                            : 'hidden lg:block lg:opacity-100 lg:translate-y-0'
                    }`}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-blue-600" />
                                    Filters
                                </h3>
                                {showFilters && (
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Location Services - Clean */}
                            <div className="mb-6">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <LocationIcon className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold text-green-800">{t('location_services')}</span>
                                    </div>
                                    <Button 
                                        onClick={getCurrentLocation} 
                                        disabled={gettingLocation}
                                        className={`w-full transition-all duration-200 ${
                                            userCoords 
                                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                : gettingLocation 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white border border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                                        }`}
                                    >
                                        {gettingLocation ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {t('locating')}
                                            </>
                                        ) : userCoords ? (
                                            <>
                                                <LocationIcon className="w-4 h-4 mr-2" />
                                                {t('location_active')}
                                            </>
                                        ) : (
                                            <>
                                                <LocationIcon className="w-4 h-4 mr-2" />
                                                {t('use_my_location')}
                                            </>
                                        )}
                                    </Button>
                                    {userCoords && (
                                        <div className="mt-3 p-3 bg-white/80 rounded-lg border border-green-200">
                                            <p className="text-sm text-green-700 font-medium flex items-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                                {t('gps_location_active')}
                                            </p>
                                            {userCoords.accuracy && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {t('accuracy')}: {userCoords.accuracy < 10 ? t('accuracy_very_precise') : 
                                                               userCoords.accuracy < 100 ? t('accuracy_good') : 
                                                               userCoords.accuracy < 1000 ? t('accuracy_fair') : t('accuracy_poor')} 
                                                    ({userCoords.accuracy > 1000 ? 
                                                      `${(userCoords.accuracy/1000).toFixed(1)}km` : 
                                                      `${userCoords.accuracy.toFixed(0)}m`})
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Google Maps URL Input */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <LinkIcon className="w-4 h-4 text-blue-600" />
                                    <label className="text-sm font-medium text-blue-900">
                                        {t('share_google_maps_location')}
                                    </label>
                                </div>
                                <p className="text-xs text-blue-700 mb-3">
                                    {t('paste_google_maps_link')}
                                </p>
                                <div className="space-y-2">
                                    <Input
                                        placeholder={t('google_maps_placeholder')}
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
                                                {t('processing_link')}
                                            </>
                                        ) : (
                                            <>
                                                <LinkIcon className="w-3 h-3 mr-2" />
                                                {t('use_this_location')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Location Dropdowns */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('province')}</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: t('all_provinces') },
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
                                        placeholder={t('select_province')}
                                        className="text-gray-900"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('district')}</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: t('all_districts') },
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
                                        placeholder={loadingDistricts ? t('loading_districts') : t('select_district')}
                                        loading={loadingDistricts}
                                        disabled={loadingDistricts || !selectedProvince}
                                        className="text-gray-900"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('commune')}</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: t('all_communes') },
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
                                        placeholder={loadingCommunes ? t('loading_communes') : t('select_commune')}
                                        loading={loadingCommunes}
                                        disabled={loadingCommunes || !selectedDistrict}
                                        className="text-gray-900"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('village')}</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: t('all_villages') },
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
                                        placeholder={loadingVillages ? t('loading_villages') : t('select_village')}
                                        loading={loadingVillages}
                                        disabled={loadingVillages || !selectedCommune}
                                        className="text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('service_type')}</label>
                                <Input
                                    placeholder={t('service_placeholder')}
                                    value={serviceFilter}
                                    onChange={(e) => setServiceFilter(e.target.value)}
                                    className="text-gray-900"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button 
                                    onClick={handleSearch} 
                                    disabled={searchLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {searchLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {t('searching')}
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4 mr-2" />
                                            {t('apply_filters')}
                                        </>
                                    )}
                                </Button>
                                
                                {(searchTerm || selectedProvince || selectedDistrict || selectedCommune || selectedVillage || serviceFilter || userCoords) && (
                                    <Button 
                                        variant="outline" 
                                        onClick={clearFilters} 
                                        className="w-full border-2 border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 font-semibold py-3 transition-all duration-200 transform hover:scale-105 active:scale-95"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {t('clear_all_filters')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Results */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {userCoords ? (
                                            <span className="flex items-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                                                {t('nearest_tire_shops')}
                                            </span>
                                        ) : (
                                            t('available_tire_shops')
                                        )}
                                    </h2>
                                    <p className="text-gray-600 text-lg">
                                        {searchLoading ? (
                                            <span className="flex items-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {t('searching_tire_shops')}
                                            </span>
                                        ) : userCoords ? (
                                            t('found_shops_by_distance', { count: businesses.total })
                                        ) : (
                                            t('professional_shops_ready', { count: businesses.total })
                                        )}
                                    </p>
                                    {userCoords && !searchLoading && (
                                        <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                                            <MapPin className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-green-700 font-medium">
                                                {t('gps_active_showing_nearest')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {!searchLoading && businesses.total > 0 && (
                                    <div className="text-center sm:text-right">
                                        <div className="text-3xl font-bold text-blue-600">{businesses.total}</div>
                                        <div className="text-sm text-gray-500">{t('shops_found')}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                {/* Loading Skeleton */}
                {searchLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                                <div className="h-56 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 bg-gray-200 rounded-full px-3 py-1 w-16"></div>
                                        <div className="h-6 bg-gray-200 rounded-full px-3 py-1 w-20"></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Business Grid - Clean Cards */}
                {!searchLoading && businesses.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {businesses.data.map((business, index) => (
                            <Card key={`business-${business.id || index}`} className="py-0 group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden bg-white border border-gray-200">
                                <Link href={`/tire-shops/${String(business.slug)}`} className="block">
                                    {/* Business Image - Clean */}
                                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                        {business.image ? (
                                            <img 
                                                src={getImageUrl(business.image, 'businesses')} 
                                                alt={String(business.name)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    img.style.display = 'none';
                                                    const parent = img.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div class="text-center p-4"><div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div><p class="text-base font-medium text-gray-700">Tire Shop</p><p class="text-sm text-gray-500">Professional Service</p></div></div>';
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                                <div className="text-center p-4">
                                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-base font-medium text-gray-700">{t('tire_shop')}</p>
                                                    <p className="text-sm text-gray-500">{t('professional_service')}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Enhanced Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        {/* Distance Badge - Clean */}
                                        {business.distance !== undefined && userCoords && (
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-green-600 text-white shadow-lg px-3 py-1.5 text-sm font-semibold">
                                                    <Navigation className="w-3 h-3 mr-1" />
                                                    {(() => {
                                                        const distance = parseFloat(String(business.distance));
                                                        if (distance < 1) {
                                                            return `${(distance * 1000).toFixed(0)}m`;
                                                        } else {
                                                            return `${distance.toFixed(1)}km`;
                                                        }
                                                    })()}
                                                </Badge>
                                            </div>
                                        )}
                                        
                                        {/* Verified Badge */}
                                        {/* <div className="absolute top-4 right-4">
                                            <Badge className="bg-emerald-500/90 hover:bg-emerald-600 text-white shadow-xl backdrop-blur-sm border-0 px-3 py-1.5 text-sm font-semibold">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Verified
                                            </Badge>
                                        </div> */}
                                        
                                        {/* Quick Action Buttons - Show on Hover */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <div className="flex gap-2">
                                                {business.phone && (
                                                    <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110">
                                                        <Phone className="w-4 h-4 text-green-600" />
                                                    </button>
                                                )}
                                                {business.website && (
                                                    <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110">
                                                        <Globe className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <CardContent className="p-6">
                                        {/* Header - Clean */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {String(business.name)}
                                        </h3>
                                        
                                        {/* Location & Hours */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="text-sm">{getDistanceText(business)}</span>
                                            </div>
                                            {business.formatted_hours && (
                                                <div className="flex items-center text-gray-600">
                                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span className="text-sm">{String(business.formatted_hours)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {business.descriptions && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {String(business.descriptions)}
                                            </p>
                                        )}

                                        {/* Services - Clean */}
                                        {business.services && business.services.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {business.services.slice(0, 3).map((service) => (
                                                        <Badge 
                                                            key={service.id} 
                                                            variant="outline" 
                                                            className="text-xs border-blue-200 text-blue-700 bg-blue-50"
                                                        >
                                                            {service.name}
                                                        </Badge>
                                                    ))}
                                                    {business.services.length > 3 && (
                                                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 bg-gray-50">
                                                            +{business.services.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Rating & CTA - Clean */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center">
                                                {business.reviews_count && business.reviews_count > 0 ? (
                                                    <>
                                                        <div className="flex items-center mr-2">
                                                            {renderStars(Math.round(business.reviews_avg_rate || 0))}
                                                        </div>
                                                        <span className="text-gray-600 text-sm">
                                                            {business.reviews_avg_rate?.toFixed(1)} ({business.reviews_count})
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center text-gray-300 mr-2">
                                                            {renderStars(0)}
                                                        </div>
                                                        <span className="text-gray-400 text-sm">
                                                            {t('new_listing')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                                                <span className="text-sm mr-1">{t('view_details')}</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : !searchLoading ? (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            {/* Empty State Illustration */}
                            <div className="relative mb-8">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
                                    <Navigation className="w-16 h-16 text-blue-500" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {t('no_tire_shops_found')}
                            </h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {t('no_shops_description')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={clearFilters} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                                    <X className="w-4 h-4 mr-2" />
                                    {t('clear_all_filters')}
                                </Button>
                                <Button 
                                    onClick={getCurrentLocation} 
                                    variant="outline" 
                                    disabled={gettingLocation}
                                    className="px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                    {gettingLocation ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <LocationIcon className="w-4 h-4 mr-2" />
                                    )}
                                    {t('try_near_me')}
                                </Button>
                            </div>
                            
                            {/* Helpful Tips */}
                            <div className="mt-10 p-6 bg-gray-50 rounded-xl text-left">
                                <h4 className="font-semibold text-gray-900 mb-3">{t('search_tips')}</h4>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        {t('search_tip_1')}
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        {t('search_tip_2')}
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        {t('search_tip_3')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}

                        {/* Pagination */}
                        {!searchLoading && businesses.last_page > 1 && (
                            <div className="mt-16">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm text-gray-600">
                                            {t('showing_page', { current: businesses.current_page, last: businesses.last_page })}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t('showing_range', { from: businesses.from, to: businesses.to, total: businesses.total })}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {businesses.links.map((link, index) => {
                                            const isActive = link.active;
                                            const isDisabled = !link.url;
                                            const isPrevNext = link.label.includes('Previous') || link.label.includes('Next');
                                            
                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                        isActive
                                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                                                            : isDisabled
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transform hover:scale-105'
                                                    } ${
                                                        isPrevNext ? 'px-6' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WebsiteLayout>
    );
}