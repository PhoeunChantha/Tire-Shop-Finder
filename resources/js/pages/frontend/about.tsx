import React from 'react';
import { Head } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { SEOHead } from '@/components/seo-head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    MapPin, 
    Wrench, 
    Users, 
    Shield, 
    Star, 
    Clock, 
    CheckCircle, 
    Zap, 
    Heart,
    TrendingUp,
    Award,
    Search,
    Navigation,
    Phone,
    Mail,
    ArrowRight
} from 'lucide-react';

export default function About() {
    return (
        <WebsiteLayout>
            <SEOHead
                title="About Us - Cambodia's Leading Tire Shop Directory"
                description="Learn about Tire Shop Finder Cambodia - Your trusted platform for finding verified tire repair services across all 25 provinces. GPS-powered search for emergency tire assistance."
                keywords={['about tire shop finder', 'Cambodia tire directory', 'tire repair services', 'emergency tire assistance', 'verified tire shops']}
                type="website"
                url={typeof window !== 'undefined' ? window.location.href : undefined}
            />
            
            <div className="min-h-screen">
                {/* Enhanced Hero Section */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEuNSIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-500"></div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            {/* Animated Badge */}
                            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-8 animate-pulse">
                                <Award className="w-4 h-4 mr-2 text-yellow-400" />
                                Cambodia's Most Trusted Tire Directory
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                                <span className="bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent">
                                    About Our
                                </span>
                                <br />
                                <span className="text-white">
                                    Mission
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-blue-100/90 max-w-4xl mx-auto leading-relaxed mb-12">
                                We revolutionize how Cambodian drivers find tire help during emergencies. 
                                <span className="text-yellow-300 font-semibold">No more panic</span>, 
                                <span className="text-green-300 font-semibold"> just instant solutions</span> when you need them most.
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                <Button className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    <Search className="w-5 h-5 mr-2" />
                                    Find Tire Shops
                                </Button>
                                <Button variant="outline" className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Our Story
                                </Button>
                            </div>
                            
                            {/* Hero Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-yellow-300 mb-2">500+</div>
                                    <div className="text-blue-200 text-sm font-medium">Verified Shops</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-300 mb-2">25</div>
                                    <div className="text-blue-200 text-sm font-medium">Provinces</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-orange-300 mb-2">24/7</div>
                                    <div className="text-blue-200 text-sm font-medium">Support</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-purple-300 mb-2">⭐ 4.9</div>
                                    <div className="text-blue-200 text-sm font-medium">User Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        {/* Mission Section */}
                        <div className="mb-20">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Why We Exist
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Core Mission</h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Transforming tire emergencies from stressful nightmares into 
                                    <span className="text-blue-600 font-semibold"> quick, simple solutions</span>. 
                                    Because every driver deserves peace of mind on Cambodia's roads.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <Card className="group text-center bg-white border-0 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <MapPin className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">GPS-Powered Search</h3>
                                        <p className="text-gray-600 leading-relaxed">Instantly locate tire shops within meters of your exact position using advanced GPS technology</p>
                                    </CardContent>
                                </Card>

                                <Card className="group text-center bg-white border-0 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Shield className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                                <Star className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">100% Verified</h3>
                                        <p className="text-gray-600 leading-relaxed">Every shop undergoes rigorous verification for quality, reliability, and professional service standards</p>
                                    </CardContent>
                                </Card>

                                <Card className="group text-center bg-white border-0 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Wrench className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                                <Clock className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">Complete Services</h3>
                                        <p className="text-gray-600 leading-relaxed">From emergency repairs to full replacements, find comprehensive automotive tire services</p>
                                    </CardContent>
                                </Card>

                                <Card className="group text-center bg-white border-0 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Users className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                                <Heart className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Driver Community</h3>
                                        <p className="text-gray-600 leading-relaxed">Built by real drivers who understand the challenges of Cambodia's roads and traffic</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-medium mb-6">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Our Journey
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                    Born from 
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 
                                        Real Frustration
                                    </span>
                                </h2>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p className="border-l-4 border-blue-500 pl-6 bg-blue-50 py-4 rounded-r-lg">
                                        <span className="font-semibold text-gray-900">The Problem:</span> Picture this – flat tire at night, unfamiliar area, no idea where to get help. We've all been there, and it's terrifying.
                                    </p>
                                    <p className="border-l-4 border-green-500 pl-6 bg-green-50 py-4 rounded-r-lg">
                                        <span className="font-semibold text-gray-900">The Solution:</span> One simple platform that instantly connects you to verified tire shops across all 25 provinces of Cambodia.
                                    </p>
                                    <p className="border-l-4 border-purple-500 pl-6 bg-purple-50 py-4 rounded-r-lg">
                                        <span className="font-semibold text-gray-900">The Result:</span> No more panic, no more wandering. Just peace of mind knowing help is always one click away.
                                    </p>
                                </div>
                                
                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        See Our Impact
                                    </Button>
                                    <Button variant="outline" className="px-6 py-3 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                                        <Phone className="w-5 h-5 mr-2" />
                                        Contact Us
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="order-1 lg:order-2">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-1 rounded-3xl shadow-2xl">
                                        <div className="bg-white p-8 rounded-2xl">
                                            <div className="text-center mb-8">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Growing Impact</h3>
                                                <p className="text-gray-600">Real numbers from real users</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-blue-600 mb-2 flex items-center justify-center">
                                                        <TrendingUp className="w-6 h-6 mr-1" />
                                                        500+
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">Verified Shops</div>
                                                    <div className="text-xs text-gray-500 mt-1">Growing daily</div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center">
                                                        <MapPin className="w-6 h-6 mr-1" />
                                                        25
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">Provinces</div>
                                                    <div className="text-xs text-gray-500 mt-1">100% coverage</div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-orange-600 mb-2 flex items-center justify-center">
                                                        <Clock className="w-6 h-6 mr-1" />
                                                        24/7
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">Support</div>
                                                    <div className="text-xs text-gray-500 mt-1">Always online</div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-purple-600 mb-2 flex items-center justify-center">
                                                        <Star className="w-6 h-6 mr-1" />
                                                        4.9
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">User Rating</div>
                                                    <div className="text-xs text-gray-500 mt-1">Highly trusted</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Elements */}
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                                <Zap className="w-4 h-4 mr-2" />
                                Simple Process
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                From panic to problem solved in 
                                <span className="text-blue-600 font-bold"> under 60 seconds</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connecting Lines */}
                            <div className="hidden md:block absolute top-20 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-green-300 z-0"></div>
                            <div className="hidden md:block absolute top-20 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-green-300 to-orange-300 z-0"></div>
                            
                            {/* Step 1 */}
                            <div className="text-center relative z-10 group">
                                <div className="relative mb-8">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <Search className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
                                        1
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Emergency Strikes? 🚨</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Flat tire? Open our website instantly. Allow location access and we'll pinpoint your exact position.
                                    </p>
                                    <div className="text-sm text-blue-600 font-semibold">
                                        ⏱️ Takes 5 seconds
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="text-center relative z-10 group">
                                <div className="relative mb-8">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <MapPin className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
                                        2
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Pick Your Hero! 🏆</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        See verified shops sorted by distance. View ratings, services, and contact details instantly.
                                    </p>
                                    <div className="text-sm text-green-600 font-semibold">
                                        ⏱️ Takes 30 seconds
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="text-center relative z-10 group">
                                <div className="relative mb-8">
                                    <div className="bg-gradient-to-br from-orange-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        <Navigation className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
                                        3
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">You're Rescued! 🎉</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        Tap for GPS directions, call directly, or share your location. Help is on the way!
                                    </p>
                                    <div className="text-sm text-orange-600 font-semibold">
                                        ⏱️ Takes 15 seconds
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Call to Action */}
                        <div className="text-center mt-16">
                            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Ready to Never Worry About Flat Tires Again?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Join thousands of drivers who trust us for emergency tire assistance
                                </p>
                                <Button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    <Search className="w-5 h-5 mr-2" />
                                    Try It Now - Find Shops
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium mb-6">
                                <Mail className="w-4 h-4 mr-2" />
                                Let's Connect
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Ready to 
                                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    Get Started?
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Whether you're a driver seeking peace of mind or a business owner ready to serve more customers, we're here to help.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* For Customers */}
                            <Card className="group bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            For Drivers
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">Need help finding tire shops near you?</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">Have feedback about our service?</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">Want to report a business issue?</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">Looking for emergency assistance?</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Contact Support
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Send Email
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            {/* For Business Owners */}
                            <Card className="group bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Shield className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                            For Businesses
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">List your tire shop in our directory</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">Reach more customers across Cambodia</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">Get verified business status</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">24/7 emergency referrals</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                            Join Network
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Us
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Bottom CTA */}
                        <div className="text-center mt-16">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    Ready to Transform Tire Emergencies?
                                </h3>
                                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                    Join the thousands who've discovered peace of mind on Cambodia's roads
                                </p>
                                <Button className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    <Search className="w-5 h-5 mr-2" />
                                    Start Using Our Service
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WebsiteLayout>
    );
}