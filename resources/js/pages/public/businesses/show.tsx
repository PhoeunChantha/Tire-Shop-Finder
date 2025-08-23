import React from 'react';
import { Head, Link } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Business } from '@/types';
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

interface BusinessShowProps {
    business: Business;
    nearbyBusinesses: Business[];
}

export default function PublicBusinessShow({ business, nearbyBusinesses }: BusinessShowProps) {
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
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`,
                '_blank'
            );
        }
    };

    const handleCallBusiness = () => {
        // In a real app, this would be the business phone number
        alert('Phone number would be displayed here');
    };

    return (
        <WebsiteLayout>
            <Head title={`${business.name} - Tire Shop Details`} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/tire-shops">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to Directory
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {business.name}
                                    </h1>
                                    <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {getLocationString()}
                                    </div>
                                    {business.formatted_hours && (
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {business.formatted_hours}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 md:mt-0">
                                <Button onClick={handleCallBusiness} className="flex-1 md:flex-none">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Now
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={handleGetDirections}
                                    className="flex-1 md:flex-none"
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Directions
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About */}
                            {business.descriptions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About {business.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 leading-relaxed">
                                            {business.descriptions}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Services & Pricing */}
                            {business.services && business.services.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Wrench className="w-5 h-5" />
                                            Services & Pricing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {business.services.map((service) => (
                                                <div 
                                                    key={service.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">
                                                            {service.name}
                                                        </h4>
                                                        {service.descriptions && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {service.descriptions}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="flex items-center text-lg font-semibold text-green-600">
                                                            <DollarSign className="w-4 h-4" />
                                                            {service.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reviews Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="w-5 h-5" />
                                        Customer Reviews
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No reviews yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Be the first to review {business.name}
                                        </p>
                                        <Button variant="outline">
                                            Write a Review
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                                        <p className="text-gray-600">
                                            {getLocationString()}
                                        </p>
                                    </div>
                                    
                                    {business.formatted_hours && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
                                            <p className="text-gray-600">
                                                {business.formatted_hours}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 space-y-2">
                                        <Button 
                                            onClick={handleCallBusiness} 
                                            className="w-full"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Business
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={handleGetDirections}
                                            className="w-full"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Get Directions
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Services Offered</span>
                                        <span className="font-medium">
                                            {business.services?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rating</span>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                            <span className="font-medium">New</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Verification Status</span>
                                        <Badge className="bg-green-100 text-green-800">
                                            Verified
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
                                        <Link href={`/tire-shops/${nearbyBusiness.id}`}>
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {nearbyBusiness.name}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {nearbyBusiness.district?.name}, {nearbyBusiness.province?.name}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-yellow-500">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={star} className="w-4 h-4 fill-current" />
                                                        ))}
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
        </WebsiteLayout>
    );
}