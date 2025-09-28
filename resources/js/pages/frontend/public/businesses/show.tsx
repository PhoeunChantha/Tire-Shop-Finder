import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
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
    Star,
    Wrench,
    DollarSign,
    CheckCircle,
    Navigation,
    ExternalLink,
    User
} from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface BusinessShowProps {
    business: Business;
    nearbyBusinesses: Business[];
}

export default function PublicBusinessShow({ business, nearbyBusinesses }: BusinessShowProps) {
    const { t } = useTranslation();
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
        const phoneNumber = business.phone || business.owner?.phone;
        
        if (phoneNumber) {
            // For mobile devices, use tel: protocol to open phone dialer
            if (typeof window !== 'undefined') {
                window.location.href = `tel:${phoneNumber}`;
            }
        } else {
            window.toast?.info('No phone number available for this business');
        }
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

            <div className="min-h-screen bg-gray-50">
                {/* Clean Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/tire-shops">
                                <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors duration-200">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t('back_to_directory')}
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                                        {String(business.name)}
                                    </h1>
                                    <Badge className="bg-green-100 text-green-800 px-3 py-1.5 font-medium w-fit">
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        {t('verified')}
                                    </Badge>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600 mt-4">
                                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                                        <span className="font-medium">{getLocationString()}</span>
                                    </div>
                                    {business.formatted_hours && (
                                        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                                            <Clock className="w-5 h-5 mr-2 text-gray-500" />
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
                                            ({business.reviews_count} {business.reviews_count === 1 ? t('review') : t('reviews')})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Desktop buttons */}
                            <div className="hidden lg:flex flex-col gap-3 lg:w-64">
                                <Button
                                    onClick={handleCallBusiness}
                                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors py-3 px-6"
                                    size="lg"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    {t('call_now')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleGetDirections}
                                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-3 px-6"
                                    size="lg"
                                >
                                    <Navigation className="w-5 h-5 mr-2" />
                                    {t('get_directions')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Business Image - Clean */}
                            {business.image && (
                                <Card className="py-0 overflow-hidden shadow-sm border border-gray-200">
                                    <div className="relative aspect-video">
                                        <img
                                            src={getImageUrl(business.image, 'businesses')}
                                            alt={`${business.name} - Business Photo`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('hidden');
                                            }}
                                        />
                                    </div>
                                </Card>
                            )}

                            {/* About - Clean */}
                            {business.descriptions && (
                                <Card className="shadow-sm border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            About {String(business.name)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 leading-relaxed">
                                            {String(business.descriptions)}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Services & Pricing - Clean */}
                            {business.services && business.services.length > 0 && (
                                <Card className="shadow-sm border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <Wrench className="w-5 h-5 text-blue-600" />
                                            <span className="text-xl font-bold text-gray-900">Services & Pricing</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {business.services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {service.name}
                                                        </h4>
                                                        <div className="flex items-center text-lg font-bold text-green-600">
                                                            <DollarSign className="w-4 h-4" />
                                                            <span>{service.price}</span>
                                                        </div>
                                                    </div>
                                                    {service.descriptions && (
                                                        <p className="text-sm text-gray-600">
                                                            {service.descriptions}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reviews Section - Clean */}
                            <Card className="shadow-sm border border-gray-200">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-blue-600" />
                                        <span className="text-xl font-bold text-gray-900">Customer Reviews</span>
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
                                        className="border-gray-300"
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
                            {/* Location Card - Clean */}
                            {business.latitude && business.longitude && (
                                <Card className="shadow-sm border border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            <span className="text-xl font-bold text-gray-900">Location & Directions</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {/* Map Preview - Clean */}
                                        <div
                                            className="relative  w-full h-48 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                                            onClick={() => {
                                                const url = `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
                                                window.open(url, '_blank');
                                            }}
                                        >
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                                <div className="p-3 bg-blue-600 rounded-full mb-3">
                                                    <MapPin className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-2">
                                                    View on Google Maps
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {parseFloat(business.latitude).toFixed(4)}°, {parseFloat(business.longitude).toFixed(4)}°
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons - Clean */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <Button
                                                    onClick={handleGetDirections}
                                                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
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
                                                    className="border-gray-300 cursor-pointer hover:bg-gray-50"
                                                    size="sm"
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Open Maps
                                                </Button>
                                            </div>

                                            {/* Address Display */}
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">
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

                            {/* Contact Info - Clean */}
                            <Card className="shadow-sm border border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-green-600" />
                                        <span className="text-xl font-bold text-gray-900">Contact Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        {/* Owner Profile */}
                                        {business.owner && (
                                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    {business.owner.profile ? (
                                                        <img 
                                                            src={getImageUrl(business.owner.profile, 'users')} 
                                                            alt={business.owner.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-5 h-5 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Business Owner</h4>
                                                    <p className="text-gray-700 font-medium">
                                                        {business.owner.first_name && business.owner.last_name 
                                                            ? `${business.owner.first_name} ${business.owner.last_name}`
                                                            : business.owner.name}
                                                    </p>
                                                    {business.owner.phone && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            📞 {business.owner.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

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

                                        {/* Business Phone */}
                                        {business.phone && (
                                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                                                <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">Business Phone</h4>
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {business.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 space-y-3">
                                        <Button
                                            onClick={handleCallBusiness}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                                            size="lg"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            Call Business
                                        </Button>
                                        {/* <Button
                                            variant="outline"
                                            onClick={handleGetDirections}
                                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                                            size="lg"
                                        >
                                            <Navigation className="w-5 h-5 mr-2" />
                                            Get Directions
                                        </Button> */}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Business Stats - Clean */}
                            <Card className="shadow-sm border border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-purple-600" />
                                        <span className="text-xl font-bold text-gray-900">Business Stats</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Wrench className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium text-gray-700">Services Offered</span>
                                        </div>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {business.services?.length || 0}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-yellow-600" />
                                            <span className="font-medium text-gray-700">Customer Rating</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {business.reviews_count && business.reviews_count > 0 ? (
                                                <>
                                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        ⭐ {(business.reviews_avg_rate || 0).toFixed(1)}
                                                    </span>
                                                    <span className="text-sm text-gray-600">({business.reviews_count})</span>
                                                </>
                                            ) : (
                                                <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    No reviews
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-gray-700">Verification Status</span>
                                        </div>
                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            ✓ Verified
                                        </span>
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

            {/* Mobile floating action buttons */}
            <div className="lg:hidden fixed bottom-20 right-4 z-50">
                <div className="flex flex-col gap-2">
                    <Button
                        onClick={handleCallBusiness}
                        className="w-15 h-15 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-4 border-white"
                        size="lg"
                    >
                        <Phone className="w-6 h-6" />
                    </Button>
                    <Button
                        onClick={handleGetDirections}
                        className="w-15 h-15 rounded-full bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 border-4 border-gray-200"
                        size="lg"
                    >
                        <Navigation className="w-6 h-6" />
                    </Button>
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