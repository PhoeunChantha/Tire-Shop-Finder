import React from 'react';
import { useTranslation } from 'react-i18next';
import WebsiteLayout from '@/layouts/website-layout';
import { SEOHead } from '@/components/seo-head';
import { Card, CardContent } from '@/components/ui/card';
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

interface AboutPageProps {
    aboutBanner?: string;
}

export default function About({ aboutBanner }: AboutPageProps) {
    const { t } = useTranslation();
    
    return (
        <WebsiteLayout>
            <SEOHead
                title={t('about_us') + ' - ' + t('cambodia_leading_directory')}
                description={t('about_description')}
                keywords={['about tire shop finder', 'Cambodia tire directory', 'tire repair services', 'emergency tire assistance', 'verified tire shops']}
                type="website"
                url={typeof window !== 'undefined' ? window.location.href : undefined}
            />
            
            <div className="min-h-screen">
                {/* Clean Professional Hero Section */}
                <div className="relative text-white overflow-hidden">
                    {/* Background with custom banner or fallback */}
                    {aboutBanner ? (
                        <div className="absolute inset-0">
                            <img 
                                src={aboutBanner} 
                                alt="About page banner" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/70" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-slate-900" />
                    )}
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            {/* Professional Badge */}
                            <div className="inline-flex items-center px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-8">
                                <Award className="w-4 h-4 mr-2 text-blue-400" />
                                {t('cambodia_most_trusted_directory')}
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                                <span className="text-white">
                                    {t('about_us')}
                                </span>
                                <br />
                                <span className="text-blue-400">
                                    {t('our_mission')}
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12">
                                {t('we_revolutionize')} 
                                <span className="text-blue-400 font-semibold">{t('no_more_panic')}</span>, 
                                <span className="text-blue-300 font-semibold"> {t('just_instant_solutions')}</span> {t('when_you_need_them_most')}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                <Button className="px-8 py-4 bg-white text-slate-900 hover:bg-gray-100 rounded-xl font-semibold transition-colors shadow-lg">
                                    <Search className="w-5 h-5 mr-2" />
                                    {t('find_tire_shops')}
                                </Button>
                                <Button variant="outline" className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold transition-colors">
                                    <Heart className="w-5 h-5 mr-2" />
                                    {t('our_story')}
                                </Button>
                            </div>
                            
                            {/* Hero Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                                    <div className="text-white/80 text-sm font-medium">{t('verified_shops')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-300 mb-2">25</div>
                                    <div className="text-white/80 text-sm font-medium">{t('provinces')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-200 mb-2">24/7</div>
                                    <div className="text-white/80 text-sm font-medium">{t('support')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-100 mb-2">⭐ 4.9</div>
                                    <div className="text-white/80 text-sm font-medium">{t('user_rating')}</div>
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
                                    {t('why_we_exist')}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('our_core_mission')}</h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    {t('transforming_tire_emergencies')} 
                                    <span className="text-blue-600 font-semibold"> {t('quick_simple_solutions')}</span>. 
                                    {t('every_driver_deserves')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <Card className="group text-center bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
                                                <MapPin className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gps_powered_search')}</h3>
                                        <p className="text-gray-600 leading-relaxed">{t('instantly_locate_shops')}</p>
                                    </CardContent>
                                </Card>

                                <Card className="group text-center bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto">
                                                <Shield className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('hundred_percent_verified')}</h3>
                                        <p className="text-gray-600 leading-relaxed">{t('every_shop_verified')}</p>
                                    </CardContent>
                                </Card>

                                <Card className="group text-center bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto">
                                                <Wrench className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('complete_services')}</h3>
                                        <p className="text-gray-600 leading-relaxed">{t('emergency_repairs_replacements')}</p>
                                    </CardContent>
                                </Card>

                                <Card className="group text-center bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="pt-8 pb-6 px-6">
                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto">
                                                <Users className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('driver_community')}</h3>
                                        <p className="text-gray-600 leading-relaxed">{t('built_by_real_drivers')}</p>
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
                                    {t('our_journey')}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                    {t('born_from_real_frustration').split(' ').slice(0, 2).join(' ')} 
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 
                                        {t('born_from_real_frustration').split(' ').slice(2).join(' ')}
                                    </span>
                                </h2>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p className="border-l-4 border-blue-500 pl-6 bg-blue-50 py-4 rounded-r-lg">
                                        <span className="font-semibold text-gray-900">{t('the_problem')}</span> {t('picture_flat_tire')}
                                    </p>
                                    <p className="border-l-4 border-green-500 pl-6 bg-green-50 py-4 rounded-r-lg">
                                        <span className="font-semibold text-gray-900">{t('the_solution')}</span> {t('one_simple_platform')}
                                    </p>
                                    <p className="border-l-4 border-purple-500 pl-6 bg-purple-50 py-4 rounded-r-lg">
                                        <span className="font-semibold text-gray-900">{t('the_result')}</span> {t('no_more_panic_wandering')}
                                    </p>
                                </div>
                                
                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        {t('see_our_impact')}
                                    </Button>
                                    <Button variant="outline" className="px-6 py-3 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                                        <Phone className="w-5 h-5 mr-2" />
                                        {t('contact_us')}
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="order-1 lg:order-2">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-1 rounded-3xl shadow-2xl">
                                        <div className="bg-white p-8 rounded-2xl">
                                            <div className="text-center mb-8">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('our_growing_impact')}</h3>
                                                <p className="text-gray-600">{t('real_numbers_users')}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-blue-600 mb-2 flex items-center justify-center">
                                                        <TrendingUp className="w-6 h-6 mr-1" />
                                                        500+
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">{t('verified_shops')}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{t('growing_daily')}</div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center">
                                                        <MapPin className="w-6 h-6 mr-1" />
                                                        25
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">{t('provinces')}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{t('hundred_percent_coverage')}</div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-orange-600 mb-2 flex items-center justify-center">
                                                        <Clock className="w-6 h-6 mr-1" />
                                                        24/7
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">{t('support')}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{t('always_online')}</div>
                                                </div>
                                                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
                                                    <div className="text-3xl font-bold text-purple-600 mb-2 flex items-center justify-center">
                                                        <Star className="w-6 h-6 mr-1" />
                                                        4.9
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">{t('user_rating')}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{t('highly_trusted')}</div>
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
                                {t('simple_process')}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {t('how_it_works')}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                {t('from_panic_to_solved')} 
                                <span className="text-blue-600 font-bold"> {t('under_60_seconds')}</span>
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{t('emergency_strikes')}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {t('flat_tire_open_website')}
                                    </p>
                                    <div className="text-sm text-blue-600 font-semibold">
                                        {t('takes_5_seconds')}
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{t('pick_your_hero')}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {t('see_verified_shops')}
                                    </p>
                                    <div className="text-sm text-green-600 font-semibold">
                                        {t('takes_30_seconds')}
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{t('youre_rescued')}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {t('tap_gps_directions')}
                                    </p>
                                    <div className="text-sm text-orange-600 font-semibold">
                                        {t('takes_15_seconds')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Call to Action */}
                        <div className="text-center mt-16">
                            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {t('ready_never_worry')}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {t('join_thousands_drivers')}
                                </p>
                                <Button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    <Search className="w-5 h-5 mr-2" />
                                    {t('try_it_now')}
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
                                {t('lets_connect')}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {t('ready_to_get_started').split(' ').slice(0, 2).join(' ')} 
                                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    {t('ready_to_get_started').split(' ').slice(2).join(' ')}
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {t('whether_driver_business')}
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
                                            {t('for_drivers')}
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('need_help_finding')}</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('have_feedback_service')}</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('want_report_business')}</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('looking_emergency_assistance')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {t('contact_support')}
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {t('send_email')}
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
                                            {t('for_businesses')}
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('list_your_tire_shop')}</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('reach_more_customers')}</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('get_verified_status')}</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700">{t('emergency_referrals')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                            {t('join_network')}
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-105">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {t('call_us')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Bottom CTA */}
                        <div className="text-center mt-16">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    {t('ready_transform_emergencies')}
                                </h3>
                                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                    {t('join_thousands_discovered')}
                                </p>
                                <Button className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    <Search className="w-5 h-5 mr-2" />
                                    {t('start_using_service')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WebsiteLayout>
    );
}