import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Business } from '@/types';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/reviews/ReviewCard';
import LoginRequiredModal from '@/components/modals/LoginRequiredModal';
import { SEOHead } from '@/components/seo-head';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Phone,
    Mail,
    Star,
    Wrench,
    DollarSign,
    CheckCircle,
    Navigation,
    ExternalLink
} from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface BusinessShowProps {
    business: Business;
    nearbyBusinesses: Business[];
}

export default function PublicBusinessShow({ business, nearbyBusinesses }: BusinessShowProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { props } = usePage();
    const auth = props.auth as { user: any };
    const url = props.ziggy?.location || window.location.pathname;

    const safeString = (value: unknown): string => {
        if (value == null || typeof value === 'symbol') {
            return '';
        }
        return String(value);
    };

    const renderStars = (rating: number) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-4 h-4 ${star <= rating
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                    }`}
            />
        ));
    };

    const getLocationString = () => {
        const parts = [
            business.village?.name,
            business.commune?.name,
            business.district?.name,
            business.province?.name
        ].filter(Boolean);

        return parts.join(', ');
    };

    const handleGetDirections = () => {
        if (business.latitude && business.longitude) {
            const destLat = parseFloat(business.latitude);
            const destLng = parseFloat(business.longitude);

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            if (navigator.geolocation) {
                const options = {
                    enableHighAccuracy: true,
                    timeout: 10000, // 10 seconds timeout
                    maximumAge: 300000 // 5 minutes cache
                };

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;

                        console.log(`Got user location: ${userLat}, ${userLng}`);

                        if (isIOS) {
                            window.open(
                                `http://maps.apple.com/?saddr=${userLat},${userLng}&daddr=${destLat},${destLng}`,
                                '_blank'
                            );
                        } else {
                            window.open(
                                `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}`,
                                '_blank'
                            );
                        }
                    },
                    (error) => {
                        console.log('Geolocation failed:', error.message);
                        // Fallback to destination-only directions
                        if (isIOS) {
                            window.open(
                                `http://maps.apple.com/?daddr=${destLat},${destLng}`,
                                '_blank'
                            );
                        } else {
                            window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`,
                                '_blank'
                            );
                        }
                    },
                    options
                );
            } else {
                console.log('Geolocation not supported');
                if (isIOS) {
                    window.open(
                        `http://maps.apple.com/?daddr=${destLat},${destLng}`,
                        '_blank'
                    );
                } else {
                    window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`,
                        '_blank'
                    );
                }
            }
        }
    };



    const handleCallBusiness = () => {
        // In a real app, this would be the business phone number
        toast.info('Phone number would be displayed here');
    };

    const handleWriteReview = () => {
        if (!auth.user) {
            setShowLoginModal(true);
        } else {
            setShowReviewForm(true);
        }
    };

    return (
        <WebsiteLayout>
            <SEOHead
                title={safeString(business.seo_title || business.name)}
                description={safeString(business.seo_description || business.descriptions || `Professional tire services at ${safeString(business.name)}. Find tire installation, repair, and replacement services in ${getLocationString()}.`)}
                image={safeString(business.seo_image || business.image)}
                type="business.business"
                keywords={business.seo_keywords || [`tire shop`, `tire services`, safeString(business.name), getLocationString()]}
                url={typeof window !== 'undefined' ? window.location.href : undefined}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                {/* Enhanced Header */}
                <div className="bg-white shadow-lg border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/tire-shops">
                                <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors duration-200">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Directory
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                                        {String(business.name)}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4 mr-1.5" />
                                            Verified Business
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-gray-600">
                                    <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                        <span className="font-medium">{getLocationString()}</span>
                                    </div>
                                    {business.formatted_hours && (
                                        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                                            <Clock className="w-5 h-5 mr-2 text-green-600" />
                                            <span className="font-medium">{String(business.formatted_hours)}</span>
                                        </div>
                                    )}
                                </div>

                                {business.reviews_count > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {renderStars(Math.round(business.reviews_avg_rate || 0))}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {(business.reviews_avg_rate || 0).toFixed(1)}
                                        </span>
                                        <span className="text-gray-600">
                                            ({business.reviews_count} review{business.reviews_count !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-64">
                                <Button
                                    onClick={handleCallBusiness}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-3 px-6"
                                    size="lg"
                                >
                                    <Phone className="w-5 h-5 mr-3" />
                                    Call Business
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleGetDirections}
                                    className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-200 py-3 px-6"
                                    size="lg"
                                >
                                    <Navigation className="w-5 h-5 mr-3" />
                                    Get Directions
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Business Image */}
                            {business.image && (
                                <Card className="py-0 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                    <div className="relative h-64 md:h-80 lg:h-96">
                                        <img
                                            src={getImageUrl(business.image, 'businesses')}
                                            alt={`${business.name} - Business Photo`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('hidden');
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {String(business.name)}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Professional tire services in {business.district?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* About */}
                            {business.descriptions && (
                                <Card className="py-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="p-2 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
                                        <CardTitle className="text-xl font-semibold text-gray-800">
                                            About {String(business.name)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-gray-700 leading-relaxed text-base">
                                            {String(business.descriptions)}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Services & Pricing */}
                            {business.services && business.services.length > 0 && (
                                <Card className="py-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Wrench className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="text-xl font-semibold text-gray-800">Services & Pricing</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                                {business.services.map((service, index) => (
                                                    <div
                                                        key={service.id}
                                                        className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200"
                                                    >
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                                                {service.name}
                                                            </h4>
                                                            {service.descriptions && (
                                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                                    {service.descriptions}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="ml-6 text-right">
                                                            <div className="flex items-center text-xl font-bold text-emerald-600">
                                                                <DollarSign className="w-5 h-5" />
                                                                <span>{service.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            )}

                            {/* Reviews Section */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="w-5 h-5" />
                                        Customer Reviews
                                        {business.reviews && business.reviews.length > 0 && (
                                            <span className="text-sm font-normal text-gray-500">
                                                ({business.reviews.length} review{business.reviews.length !== 1 ? 's' : ''})
                                            </span>
                                        )}
                                    </CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleWriteReview}
                                    >
                                        Write a Review
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {business.reviews && business.reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {business.reviews.map((review) => (
                                                <ReviewCard key={review.id} review={review} />
                                            ))}

                                            {/* Show more reviews link if there are more */}
                                            {business.reviews_count > business.reviews.length && (
                                                <div className="text-center pt-4 border-t">
                                                    <p className="text-gray-600 mb-2">
                                                        Showing {business.reviews.length} of {business.reviews_count} reviews
                                                    </p>
                                                    <Button variant="outline" size="sm">
                                                        View All Reviews
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No reviews yet
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Be the first to review {String(business.name)}
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={handleWriteReview}
                                            >
                                                Write a Review
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Enhanced Location Card */}
                            {business.latitude && business.longitude && (
                                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-gray-800">Location & Directions</span>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {/* Interactive Map Preview */}
                                        <div
                                            className="relative w-full h-56 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 cursor-pointer group overflow-hidden"
                                            onClick={() => {
                                                const url = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
                                                window.open(url, '_blank');
                                            }}
                                        >
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 opacity-20">
                                                <div className="absolute inset-0" style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                                    backgroundSize: '30px 30px'
                                                }} />
                                            </div>

                                            {/* Content */}
                                            <div className="relative h-full flex flex-col items-center justify-center text-center p-6">
                                                <div className="mb-4">
                                                    <div className="p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                                        <MapPin className="w-8 h-8 text-blue-600" />
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                    View Interactive Map
                                                </h3>

                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-600">
                                                        📍 {parseFloat(business.latitude).toFixed(4)}°, {parseFloat(business.longitude).toFixed(4)}°
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Click to open in Google Maps
                                                    </p>
                                                </div>

                                                {/* Hover Effect */}
                                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300" />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="p-4 bg-gray-50/50">
                                            <div className="grid grid-cols-2 gap-3">
                                                <Button
                                                    onClick={handleGetDirections}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                                                    size="sm"
                                                >
                                                    <Navigation className="w-4 h-4 mr-2" />
                                                    Navigate
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        const url = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
                                                        window.open(url, '_blank');
                                                    }}
                                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Open Maps
                                                </Button>
                                            </div>

                                            {/* Address Display */}
                                            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-800 leading-relaxed">
                                                            {getLocationString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            GPS: {business.latitude}, {business.longitude}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Contact Info */}
                            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-xl font-semibold text-gray-800">Contact Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {getLocationString()}
                                                </p>
                                            </div>
                                        </div>

                                        {business.formatted_hours && (
                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                                <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {String(business.formatted_hours)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 space-y-3">
                                        <Button
                                            onClick={handleCallBusiness}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 py-3"
                                            size="lg"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            Call Business
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleGetDirections}
                                            className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-200 py-3"
                                            size="lg"
                                        >
                                            <Navigation className="w-5 h-5 mr-2" />
                                            Get Directions
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Star className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="text-xl font-semibold text-gray-800">Business Stats</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-5">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium text-gray-700">Services Offered</span>
                                        </div>
                                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {business.services?.length || 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-yellow-600" />
                                            <span className="font-medium text-gray-700">Customer Rating</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {business.reviews_count && business.reviews_count > 0 ? (
                                                <>
                                                    <div className="flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        <Star className="w-4 h-4 mr-1 fill-current" />
                                                        {(business.reviews_avg_rate || 0).toFixed(1)}
                                                    </div>
                                                    <span className="text-sm text-gray-600">({business.reviews_count})</span>
                                                </>
                                            ) : (
                                                <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    No reviews
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="font-medium text-gray-700">Verification Status</span>
                                        </div>
                                        <Badge className="bg-emerald-600 text-white px-4 py-2 text-sm font-semibold">
                                            ✓ Verified Business
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Nearby Businesses */}
                    {nearbyBusinesses.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Other Tire Shops in {business.district?.name}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {nearbyBusinesses.map((nearbyBusiness) => (
                                    <Card key={nearbyBusiness.id} className="hover:shadow-lg transition-shadow">
                                        <Link href={`/tire-shops/${nearbyBusiness.slug}`}>
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {nearbyBusiness.name}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {nearbyBusiness.district?.name}, {nearbyBusiness.province?.name}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {nearbyBusiness.reviews_count && nearbyBusiness.reviews_count > 0 ? (
                                                            <>
                                                                <div className="flex items-center">
                                                                    {renderStars(Math.round(nearbyBusiness.reviews_avg_rate || 0))}
                                                                </div>
                                                                <span className="text-gray-600 text-xs ml-1">
                                                                    ({nearbyBusiness.reviews_count})
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center text-gray-300">
                                                                {renderStars(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Badge className="bg-green-100 text-green-800">
                                                        Verified
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form Modal */}
            <ReviewForm
                isOpen={showReviewForm}
                onClose={() => setShowReviewForm(false)}
                businessId={business.id}
                businessName={String(business.name)}
            />

            {/* Login Required Modal */}
            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                action="write a review"
                redirectUrl={url}
            />
        </WebsiteLayout>
    );
}