import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BannerCarousel } from '@/components/BannerCarousel';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface Business {
  id: number;
  slug: string;
  name: string;
  location: string;
  image: string | null;
  average_rating: number;
  review_count: number;
  services: string[];
  formatted_hours: string | null;
  phone: string | null;
}

interface Banner {
  id: number;
  title: string;
  descriptions: string;
  image: string | null;
  url: string | null;
  sort_order: number;
}

interface PageProps extends Record<string, unknown> {
  banners: Banner[];
  featuredBusinesses: Business[];
}

function BusinessCard({ business }: { business: Business }) {
  const defaultImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop";
  
  return (
    <Card className="group overflow-hidden p-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-0 bg-white shadow-lg">
      <div className="aspect-video overflow-hidden relative flex-shrink-0">
        <img 
          src={getImageUrl(business.image, 'businesses') || defaultImage} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {business.average_rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">{business.average_rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {business.name}
          </h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">{business.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Users className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">{business.review_count} customer reviews</span>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {business.services.slice(0, 2).map((service, index) => (
            <span 
              key={index}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
            >
              {service}
            </span>
          ))}
          {business.services.length > 2 && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
              +{business.services.length - 2} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          {business.phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-semibold">{business.phone}</span>
            </div>
          )}
          <Link href={`/tire-shops/${business.slug || business.id}`}>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function BusinessCarousel({ businesses }: { businesses: Business[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const maxIndex = Math.max(0, businesses.length - itemsPerView);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (businesses.length > itemsPerView) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [maxIndex, businesses.length, itemsPerView, nextSlide]);

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured businesses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-4 md:gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {businesses.map((business) => (
            <div key={business.id} className={`flex-none h-full ${
              itemsPerView === 1 ? 'w-full' : 
              itemsPerView === 2 ? 'w-1/2' : 'w-1/3'
            }`}>
              <BusinessCard business={business} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      {businesses.length > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Welcome() {
  const { banners, featuredBusinesses } = usePage<PageProps>().props;
  
  return (
    <WebsiteLayout>
      {/* Hero Section with Banner Background */}
      <section className="relative text-white overflow-hidden min-h-[500px] sm:min-h-[550px] flex items-center">
        {/* Banner Background */}
        {banners && banners.length > 0 ? (
          <div className="absolute inset-0">
            <BannerCarousel banners={banners} className="h-full" backgroundOnly={true} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        )}
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="mb-6 mt-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Cambodia's Premier Tire Shop Directory</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 text-shadow-lg leading-tight">
              Find the Best 
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Tire Shops
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl block mt-2">in Cambodia</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed px-4 font-light">
              Connect with <span className="font-semibold text-yellow-400">verified</span> tire dealers, service providers, and find exactly what you need for your vehicle across Cambodia.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto px-4 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 bg-white/95 backdrop-blur-md p-3 sm:p-3 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder="Search tire shops, brands, services..." 
                      className="pl-12 border-0 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 text-base h-14 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder="Province, District, or Current Location" 
                      className="pl-12 border-0 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 text-base h-14 rounded-xl"
                    />
                  </div>
                </div>
                <Link href="/tire-shops">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full sm:w-auto shadow-lg text-base h-14 px-8 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <Search className="w-5 h-5 mr-2" />
                    Search Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-gray-600 text-sm">Verified Tire Shops</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">50K+</div>
              <div className="text-gray-600 text-sm">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">25</div>
              <div className="text-gray-600 text-sm">Provinces Covered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">4.8★</div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Carousel */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              <span>Premium Partners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tire Shops</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover Cambodia's most trusted and highly-rated tire shops with exceptional service and verified quality
            </p>
          </div>
          
          <BusinessCarousel businesses={featuredBusinesses} />
          
          <div className="text-center mt-10 sm:mt-12">
            <Link href="/tire-shops">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Search className="w-5 h-5 mr-2" />
                Explore All Tire Shops
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Platform</span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of tire shopping with our comprehensive platform designed for modern consumers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <Card className="group text-center p-6 sm:p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/50">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Smart Location Search</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Advanced GPS-based search to find the nearest tire shops with real-time distance calculations across all Cambodia provinces
                </p>
                <div className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card className="group text-center p-6 sm:p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50/50">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">100% Verified Partners</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Every tire shop undergoes rigorous verification process ensuring quality service, authentic products, and reliable business practices
                </p>
                <div className="inline-flex items-center text-green-600 font-semibold group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card className="group text-center p-6 sm:p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50/50">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Trusted Reviews</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Read authentic reviews from real customers and make informed decisions based on genuine experiences and ratings
                </p>
                <div className="inline-flex items-center text-purple-600 font-semibold group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Round-the-clock customer assistance</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Price Comparison</h4>
              <p className="text-sm text-gray-600">Compare prices across multiple shops</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Quality Guarantee</h4>
              <p className="text-sm text-gray-600">All partners meet our quality standards</p>
            </div>
            
            {/* <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Easy Booking</h4>
              <p className="text-sm text-gray-600">Book appointments with just a few clicks</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Join Our Growing Network</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
              Own a <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Tire Shop</span>?
            </h2>
            
            <p className="text-xl sm:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join Cambodia's leading tire shop directory and connect with <span className="font-bold text-yellow-300">thousands</span> of customers actively searching for tire services
            </p>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Increase Visibility</h3>
                <p className="text-sm text-white/80">Reach more customers across Cambodia</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Build Trust</h3>
                <p className="text-sm text-white/80">Get verified status and customer reviews</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Premium Features</h3>
                <p className="text-sm text-white/80">Access advanced business tools</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  <Users className="w-5 h-5 mr-2" />
                  Register Your Business Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 w-full sm:w-auto">
                  Learn How It Works
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Easy Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
}