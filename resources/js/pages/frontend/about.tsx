import React from 'react';
import { Head } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Wrench, Users, Shield } from 'lucide-react';

export default function About() {
    return (
        <WebsiteLayout>
            <Head title="About Us - Tire Shop Finder Cambodia" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                About Tire Shop Finder Cambodia
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Got a flat tire? Find the nearest tire shop instantly. We make it easy for drivers to locate tire repair services when they need help fast.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Mission Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                When you have a flat tire emergency, our website helps you quickly find the nearest tire shop so you can get back on the road fast.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Location-Based</h3>
                                    <p className="text-gray-600">Find tire shops near your exact location with GPS-powered search</p>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Shops</h3>
                                    <p className="text-gray-600">All listed tire shops are verified by our team for quality and reliability</p>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <Wrench className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Services</h3>
                                    <p className="text-gray-600">From tire repair to replacement, find complete automotive services</p>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
                                    <p className="text-gray-600">Built by drivers, for drivers across all provinces of Cambodia</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className="mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                                <div className="space-y-4 text-gray-600">
                                    <p>
                                        Nothing is worse than getting a flat tire and not knowing where to find help. That's why we created this simple website to solve one problem: making it easy to find tire shops when you need them most.
                                    </p>
                                    <p>
                                        Whether your tire goes flat in Phnom Penh, Siem Reap, or anywhere across Cambodia's 25 provinces, just open our website, allow location access, and instantly see the nearest tire shops with directions.
                                    </p>
                                    <p>
                                        No more driving around looking for tire repair. No more asking strangers for directions. Just quick, easy tire shop finding when you're stuck on the road.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                                <div className="text-center">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">500+</div>
                                            <div className="text-sm text-gray-600">Verified Shops</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">25</div>
                                            <div className="text-sm text-gray-600">Provinces Covered</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">24/7</div>
                                            <div className="text-sm text-gray-600">Emergency Support</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">100%</div>
                                            <div className="text-sm text-gray-600">Verified Listings</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                            <p className="text-lg text-gray-600">Getting help is simple and fast</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-blue-600">1</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Got a Flat Tire?</h3>
                                <p className="text-gray-600">Open our website and allow location access to find tire shops near you</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-green-600">2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Tire Shop</h3>
                                <p className="text-gray-600">See the nearest shops with distance, services, and contact info</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-orange-600">3</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get There Fast</h3>
                                <p className="text-gray-600">Click "Directions" for GPS navigation straight to the tire shop</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Get In Touch</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">
                                    Have questions or want to list your tire shop? We'd love to hear from you.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">For Customers</h4>
                                        <p className="text-gray-600">Need help finding a tire shop or have feedback about our service? Contact our support team.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">For Business Owners</h4>
                                        <p className="text-gray-600">Want to list your tire shop and reach more customers? Join our verified network of service providers.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </WebsiteLayout>
    );
}