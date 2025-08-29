import React from 'react';
import { Head, Link } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Clock, Star, Eye, Edit, Wrench, Plus, Trash2, DollarSign } from 'lucide-react';

export default function UserDashboard({ auth, business }: { auth: any; business?: any }) {
    return (
        <WebsiteLayout>
            <Head title="My Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-blue-600 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Welcome back, {auth.user.name}!
                            </h1>
                            <p className="text-xl text-blue-100">
                                Manage your tire shop and connect with customers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">1</h3>
                                <p className="text-gray-600">Business Listed</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">0</h3>
                                <p className="text-gray-600">Profile Views</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <Wrench className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">{business?.services?.length || 0}</h3>
                                <p className="text-gray-600">Services</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">Active</h3>
                                <p className="text-gray-600">Status</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Business Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Your Business
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {business ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{business.name}</h3>
                                                <p className="text-sm text-gray-600">{business.descriptions}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {business.is_vierify ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            ✓ Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            ⏳ Pending Review
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {business.is_vierify ? (
                                            <div className="text-center py-4">
                                                <div className="text-green-600 mb-2">🎉</div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Your Business is Live!
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Your tire shop is now visible to customers on our platform.
                                                </p>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Button variant="outline" className="w-fit">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Public Listing
                                                    </Button>
                                                    <Link href={`/businesses/${business.slug}/edit`}>
                                                        <Button variant="outline" className="w-fit">
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Business Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Under Review
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Your tire shop has been submitted for admin review. We'll notify you once it's approved and live on the platform.
                                                </p>
                                                <div className="space-y-2">
                                                    <Link href={`/businesses/${business.slug}/edit`}>
                                                        <Button variant="outline" className="w-full">
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Business Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No Business Listed Yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            You haven't created a business listing yet. Start by registering your tire shop!
                                        </p>
                                        <Link href="/create-business">
                                            <Button className="w-full">
                                                <Building className="w-4 h-4 mr-2" />
                                                Create Business Listing
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Services Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wrench className="w-5 h-5" />
                                    Your Services
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {business?.services && business.services.length > 0 ? (
                                    <div className="space-y-3">
                                        {business.services.slice(0, 3).map((service: any, index: number) => (
                                            <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 text-sm">{service.name}</h4>
                                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        ${service.price}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className={`w-2 h-2 rounded-full ${service.status ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {business.services.length > 3 && (
                                            <p className="text-xs text-gray-500 text-center">
                                                +{business.services.length - 3} more services
                                            </p>
                                        )}
                                        
                                        <div className="space-y-2 pt-2">
                                            <Link href={`/businesses/${business.slug}/services/create`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add More Services
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                                            No Services Added
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-4">
                                            Add services to help customers find what they need
                                        </p>
                                        {business ? (
                                            <Link href={`/businesses/${business?.slug}/services/create`}>
                                                <Button size="sm" className="w-full">
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add Your Services
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button size="sm" className="w-full" disabled>
                                                Create Business First
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                Business created successfully
                                            </p>
                                            <p className="text-xs text-gray-500">Just now</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                Account registered
                                            </p>
                                            <p className="text-xs text-gray-500">A few minutes ago</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Cards */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Update Location
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Keep your business location and contact details up to date
                                </p>
                                <Button variant="outline" size="sm">
                                    Update Details
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <Wrench className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Manage Services
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Add, edit, or remove services to showcase what you offer
                                </p>
                                {business ? (
                                    <Link href={`/businesses/${business.slug}/services/create`}>
                                        <Button variant="outline" size="sm">
                                            Manage Services
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" size="sm" disabled>
                                        Create Business First
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-6">
                                <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Get Reviews
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Encourage your customers to leave reviews and build trust
                                </p>
                                <Button variant="outline" size="sm">
                                    Learn More
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Help Section */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Learn how to optimize your business listing
                                    </p>
                                    <Button variant="ghost" size="sm">
                                        View Guide
                                    </Button>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Get help from our support team
                                    </p>
                                    <Link href="/contact">
                                        <Button variant="ghost" size="sm">
                                            Contact Us
                                        </Button>
                                    </Link>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">FAQs</h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Find answers to common questions
                                    </p>
                                    <Button variant="ghost" size="sm">
                                        Browse FAQs
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </WebsiteLayout>
    );
}