import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Phone, Mail, HelpCircle, ChevronDown, CheckCircle, AlertCircle, Loader2, Send, Users, Building, Headphones } from 'lucide-react';

const faqData = [
    {
        question: "How do I find tire shops?",
        answer: "Visit our \"Find Tire Shops\" page, allow location access, and see nearest shops with directions."
    },
    {
        question: "How to list my tire shop?",
        answer: "Register, create your business listing, and we'll verify it within 24-48 hours."
    },
    {
        question: "Is it free to use?",
        answer: "Yes! Finding tire shops is free. Business listings are also free."
    },
    {
        question: "Coverage area?",
        answer: "All 25 provinces of Cambodia, from Phnom Penh to rural areas."
    }
];

function AccordionItem({ question, answer, isOpen, onToggle }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <Collapsible open={isOpen} onOpenChange={onToggle}>
            <Card className={`transition-all duration-200 border-0 ${isOpen ? 'shadow-lg bg-white/80' : 'hover:bg-white/40 bg-white/20'}`}>
                <CollapsibleTrigger className="w-full">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between text-left">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg transition-colors duration-200 ${isOpen ? 'bg-blue-600' : 'bg-gray-100'}`}>
                                    <HelpCircle className={`w-5 h-5 transition-colors duration-200 ${isOpen ? 'text-white' : 'text-gray-600'}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 text-left">
                                    {question}
                                </h3>
                            </div>
                            <div className={`p-2 rounded-full transition-all duration-200 ${isOpen ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <ChevronDown 
                                    className={`w-5 h-5 transition-all duration-200 ${
                                        isOpen 
                                            ? 'rotate-180 text-blue-600' 
                                            : 'text-gray-500 group-hover:text-gray-700'
                                    }`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="pt-0 px-6 pb-6">
                        <div className="ml-12 border-l-2 border-blue-100 pl-4">
                            <p className="text-gray-600 leading-relaxed">
                                {answer}
                            </p>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

export default function Contact() {
    const [openItem, setOpenItem] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        
        post('/contact', {
            onSuccess: () => {
                setIsSubmitted(true);
                reset();
                setTimeout(() => setIsSubmitted(false), 5000);
            },
            onError: () => {
                // Errors handled by useForm
            }
        });
    };

    const handleInputChange = (field: keyof typeof data, value: string) => {
        setData(field, value);
        if (errors[field]) {
            clearErrors(field);
        }
    };

    return (
        <WebsiteLayout>
            <Head title="Contact Us - Tire Shop Finder Cambodia" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
                {/* Hero Section */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                                <Headphones className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                                Get in Touch
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Need help finding tire shops or want to list your business? 
                                <span className="block mt-2 text-blue-600 font-medium">We're here to help you succeed!</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Success Message */}
                    {isSubmitted && (
                        <div className="mb-8">
                            <Alert className="bg-green-50 border-green-200 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription className="font-medium">
                                    Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Contact Form */}
                    <div className="mb-16 sm:mb-20">
                        <Card className="shadow-xl overflow-hidden border-0 bg-white/70 backdrop-blur-sm">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Illustration Section */}
                                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 lg:p-12">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                                        <div className="absolute bottom-20 right-8 w-24 h-24 bg-white rounded-full"></div>
                                        <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full"></div>
                                    </div>
                                    
                                    <div className="relative z-10 text-center text-white space-y-6">
                                        <div className="w-20 h-20 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <Send className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-bold">Let's Connect</h3>
                                        <p className="text-blue-100 text-lg max-w-sm leading-relaxed">
                                            Have questions about tire shops or want to grow your business with us? We'd love to hear from you.
                                        </p>
                                        
                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/20">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">24h</div>
                                                <div className="text-blue-100 text-sm">Response Time</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-white">100%</div>
                                                <div className="text-blue-100 text-sm">Support Coverage</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Form Section */}
                                <div className="p-8 lg:p-12">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h3>
                                        <p className="text-gray-600">Fill out the form below and we'll get back to you soon.</p>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                                                        errors.name 
                                                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                                                    }`}
                                                    placeholder="Your full name"
                                                    disabled={processing}
                                                />
                                                {errors.name && (
                                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                                                        errors.email 
                                                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                                                    }`}
                                                    placeholder="your.email@example.com"
                                                    disabled={processing}
                                                />
                                                {errors.email && (
                                                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Subject
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={data.subject}
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                                                    errors.subject 
                                                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                        : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                                                }`}
                                                disabled={processing}
                                            >
                                                <option value="">Choose a subject...</option>
                                                <option value="general">General Question</option>
                                                <option value="list-business">List My Tire Shop</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="partnership">Partnership Inquiry</option>
                                                <option value="feedback">Feedback</option>
                                            </select>
                                            {errors.subject && (
                                                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.subject}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={5}
                                                value={data.message}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none ${
                                                    errors.message 
                                                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                        : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                                                }`}
                                                placeholder="Tell us how we can help you..."
                                                disabled={processing}
                                            ></textarea>
                                            {errors.message && (
                                                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.message}
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                                        >
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending Message...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Alternative Contact Methods */}
                    <div className="mb-16 sm:mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                                More Ways to Reach Us
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Choose your preferred method of communication - we're here to help however works best for you.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Phone */}
                            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                                    <p className="text-gray-600 text-sm mb-3">Quick support call</p>
                                    <a href="tel:+85512345678" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                        +855 12 345 678
                                    </a>
                                    <div className="mt-3 text-xs text-gray-500">
                                        Mon-Fri: 8AM-6PM
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Email */}
                            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                                    <p className="text-gray-600 text-sm mb-3">Detailed inquiries</p>
                                    <a href="mailto:info@tireshopfinder.kh" className="text-green-600 font-semibold hover:text-green-700 transition-colors text-sm">
                                        info@tireshopfinder.kh
                                    </a>
                                    <div className="mt-3 text-xs text-gray-500">
                                        24h response time
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                                    <p className="text-gray-600 text-sm mb-3">In-person meetings</p>
                                    <div className="text-purple-600 font-semibold">
                                        Phnom Penh
                                    </div>
                                    <div className="mt-1 text-sm text-purple-600">
                                        Cambodia
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500">
                                        By appointment
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Business Listings */}
                            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Building className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">List Business</h3>
                                    <p className="text-gray-600 text-sm mb-3">Grow your tire shop</p>
                                    <div className="text-orange-600 font-semibold text-sm">
                                        Free Listings
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500">
                                        24-48h verification
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-20">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                                <HelpCircle className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Find quick answers to common questions about our tire shop directory and services.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-0">
                                <div className="space-y-3">
                                    {faqData.map((faq, index) => (
                                        <AccordionItem
                                            key={index}
                                            question={faq.question}
                                            answer={faq.answer}
                                            isOpen={openItem === index}
                                            onToggle={() => toggleItem(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA Banner */}
                        <div className="mt-16 text-center">
                            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-0 overflow-hidden">
                                <CardContent className="p-8 sm:p-12 text-white">
                                    <div className="max-w-3xl mx-auto">
                                        <Users className="w-12 h-12 mx-auto mb-6 text-white/80" />
                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                            Still have questions?
                                        </h3>
                                        <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                                            Our support team is here to help you find the perfect tire shop or get your business listed on our platform.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Button 
                                                onClick={() => document.getElementById('name')?.focus()}
                                                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl"
                                            >
                                                Send a Message
                                            </Button>
                                            <Button 
                                                asChild
                                                variant="outline"
                                                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl"
                                            >
                                                <a href="tel:+85512345678">Call Us Now</a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </WebsiteLayout>
    );
}