import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Phone,
  Navigation,
  Shield,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

interface PageProps extends Record<string, any> {
  featuredBusinesses: Business[];
}

function BusinessCard({ business }: { business: Business }) {
  const defaultImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop";
  
  return (
    <Card className="overflow-hidden p-0 hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative">
        <img 
          src={business.image || defaultImage} 
          alt={business.name}
          className="w-full h-full object-cover"
        />
        {business.average_rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{business.average_rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{business.name}</h3>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{business.location}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <Users className="w-4 h-4" />
          <span className="text-sm">{business.review_count} reviews</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {business.services.slice(0, 2).map((service, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {service}
            </span>
          ))}
          {business.services.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{business.services.length - 2} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {business.phone && (
            <div className="flex items-center gap-1 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">{business.phone}</span>
            </div>
          )}
          <Link href={`/tire-shops/${business.slug || business.id}`}>
            <Button size="sm" className="text-sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function BusinessCarousel({ businesses }: { businesses: Business[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, businesses.length - itemsPerView);

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
  }, [maxIndex, businesses.length]);

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
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {businesses.map((business) => (
            <div key={business.id} className="flex-none w-full md:w-1/3">
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
  const { featuredBusinesses } = usePage<PageProps>().props;
  
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Best <span className="text-yellow-400">Tire Shops</span> in Cambodia
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with trusted tire dealers, service providers, and find exactly what you need for your vehicle across Cambodia.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex-1">
                  <Input 
                    placeholder="Search for tire shops, services..." 
                    className="border-0 text-gray-900 placeholder-gray-500 focus:ring-0"
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    placeholder="Location (Province, District...)" 
                    className="border-0 text-gray-900 placeholder-gray-500 focus:ring-0"
                  />
                </div>
                <Link href="/tire-shops">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Tire Shops
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover trusted and verified tire shops with excellent service across Cambodia
            </p>
          </div>
          
          <BusinessCarousel businesses={featuredBusinesses} />
          
          <div className="text-center mt-8">
            <Link href="/businesses">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 mr-2" />
                View All Tire Shops
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tire Shop Finder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find reliable tire shops and services across Cambodia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Location-Based Search</h3>
                <p className="text-gray-600">
                  Find tire shops by province, district, commune, or village across Cambodia
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Verified Businesses</h3>
                <p className="text-gray-600">
                  All listed tire shops are verified and reviewed by our community
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Community Reviews</h3>
                <p className="text-gray-600">
                  Read genuine reviews from customers to make informed decisions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Own a Tire Shop?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join our platform and connect with thousands of potential customers across Cambodia
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Users className="w-5 h-5 mr-2" />
                Register Your Business
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
}