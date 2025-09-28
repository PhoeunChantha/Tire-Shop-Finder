import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
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
import useBusinessSettings from '@/hooks/use-business-settings';

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
  const { t } = useTranslation();
  const defaultImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop";
  
  return (
    <Card className="py-0 group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white border border-gray-200">
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={getImageUrl(business.image, 'businesses') || defaultImage} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {business.average_rating > 0 && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900">{business.average_rating}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {business.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{business.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{business.review_count} {t('customer_reviews')}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {business.services.slice(0, 2).map((service, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
            >
              {service}
            </span>
          ))}
          {business.services.length > 2 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md">
              +{business.services.length - 2} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          {business.phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">{business.phone}</span>
            </div>
          )}
          <Link href={`/tire-shops/${business.slug || business.id}`}>
            <Button size="sm" className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors">
              {t('view_details')}
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
  const { t } = useTranslation();
  const { businessData } = useBusinessSettings();
  
  return (
    <WebsiteLayout>
      {/* Hero Section - Clean & Professional */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Clean Gradient Background */}
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
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full text-center">
          {/* Professional Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/90">{t('premier_directory')}</span>
          </div>
          
          {/* Clean Typography */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            <span className="text-white">{t('find_best_tire_shops')}</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('tire_shops')}
            </span>
            <br />
            <span className="text-white/90 text-3xl lg:text-4xl xl:text-5xl font-semibold">{t('in_cambodia')}</span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-12 text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
            {t('connect_verified')}
          </p>
          
          {/* Professional Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder={t('search_placeholder')} 
                      className="pl-12 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base h-14 rounded-xl transition-all"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder={t('location_placeholder')} 
                      className="pl-12 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base h-14 rounded-xl transition-all"
                    />
                  </div>
                </div>
                <Link href="/tire-shops">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto shadow-lg text-base h-14 px-8 rounded-xl font-semibold transition-all duration-200">
                    <Search className="w-5 h-5 mr-2" />
                    {t('search_now')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Clean Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {businessData.statsTireShops ? `${parseInt(businessData.statsTireShops).toLocaleString()}+` : '1000+'}
              </div>
              <div className="text-gray-600 font-medium">{t('verified_tire_shops')}</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {businessData.statsHappyCustomers ? 
                  `${Math.round(parseInt(businessData.statsHappyCustomers)/1000)}K+` : 
                  '50K+'
                }
              </div>
              <div className="text-gray-600 font-medium">{t('happy_customers')}</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {businessData.statsProvincesCovered || '25'}
              </div>
              <div className="text-gray-600 font-medium">{t('provinces_covered')}</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {businessData.statsAverageRating ? 
                  `${parseFloat(businessData.statsAverageRating).toFixed(1)}★` : 
                  '4.8★'
                }
              </div>
              <div className="text-gray-600 font-medium">{t('average_rating')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses - Clean Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              <span>{t('premium_partners')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('featured_tire_shops')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('discover_trusted')}
            </p>
          </div>
          
          <BusinessCarousel businesses={featuredBusinesses} />
          
          <div className="text-center mt-12">
            <Link href="/tire-shops">
              <Button size="lg" className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200">
                <Search className="w-5 h-5 mr-2" />
                {t('explore_all')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Modern & Clean */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('why_choose')}?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('experience_future')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="group text-center p-8 bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('smart_location_search')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('smart_location_desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center p-8 bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('verified_partners')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('verified_partners_desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center p-8 bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('trusted_reviews')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('trusted_reviews_desc')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">{t('support_247')}</h4>
              <p className="text-sm text-gray-600">{t('support_247_desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">{t('price_comparison')}</h4>
              <p className="text-sm text-gray-600">{t('price_comparison_desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <Award className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">{t('quality_guarantee')}</h4>
              <p className="text-sm text-gray-600">{t('quality_guarantee_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Professional & Clean */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('join_network')}</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t('own_tire_shop')}?
            </h2>
            
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              {t('join_directory')}
            </p>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">{t('increase_visibility')}</h3>
                <p className="text-sm text-white/70">{t('increase_visibility_desc')}</p>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">{t('build_trust')}</h3>
                <p className="text-sm text-white/70">{t('build_trust_desc')}</p>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">{t('premium_features')}</h3>
                <p className="text-sm text-white/70">{t('premium_features_desc')}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/register">
                <Button size="lg" className="bg-white cursor-pointer text-slate-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200">
                  <Users className="w-5 h-5 mr-2" />
                  {t('register_free')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-black cursor-pointer hover:bg-white/10 px-8 py-4 rounded-xl transition-all duration-200">
                  {t('learn_how_works')}
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{t('free_to_join')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{t('easy_setup')}</span>
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