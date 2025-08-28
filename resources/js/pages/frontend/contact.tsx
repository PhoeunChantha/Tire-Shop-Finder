import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle, ChevronDown } from 'lucide-react';

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
            <Card className="hover:shadow-md transition-shadow">
                <CollapsibleTrigger className="w-full">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between text-left">
                            <div className="flex items-start space-x-3">
                                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                    {question}
                                </h3>
                            </div>
                            <ChevronDown 
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="pt-0 p-4 sm:p-6">
                        <div className="ml-8 sm:ml-9">
                            <p className="text-sm sm:text-base text-gray-600">
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

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index);
    };

    return (
        <WebsiteLayout>
            <Head title="Contact Us - Tire Shop Finder Cambodia" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Contact Us
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                                Need help finding tire shops or want to list your business? We're here to help!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Contact Form with Image */}
                    <div className="mb-12 sm:mb-16">
                        <Card className="shadow-sm overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Image Section */}
                                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center">
                                    <div className="text-center text-white space-y-4">
                                        <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Get in Touch</h3>
                                        <p className="text-blue-100 max-w-sm">
                                            Need help finding tire shops or want to list your business? We're here to assist you.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Form Section */}
                                <div className="p-6 lg:p-8">
                                    <CardHeader className="px-0 pt-0 pb-6">
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <MessageSquare className="w-5 h-5" />
                                            Send Message
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0">
                                        <form className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subject *
                                                </label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="general">General Question</option>
                                                    <option value="list-business">List My Tire Shop</option>
                                                    <option value="technical">Technical Support</option>
                                                    <option value="feedback">Feedback</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Message *
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                                    placeholder="How can we help you?"
                                                    required
                                                ></textarea>
                                            </div>

                                            <Button type="submit" className="w-full">
                                                Send Message
                                            </Button>
                                        </form>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Get In Touch Section */}
                    <div className="mb-12 sm:mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                            <p className="text-gray-600">
                                Multiple ways to reach us for support and assistance.
                            </p>
                        </div>

                        {/* Contact Cards - Flex Layout */}
                        <div className="flex flex-wrap gap-6 justify-center">
                            <Card className="hover:shadow-md transition-shadow flex-1 min-w-[280px] max-w-[320px]">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                                            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Phone</h3>
                                            <p className="text-blue-600 font-medium">+855 12 345 678</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow flex-1 min-w-[280px] max-w-[320px]">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Email</h3>
                                            <p className="text-green-600 font-medium break-all">info@tireshopfinder.kh</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow flex-1 min-w-[280px] max-w-[320px]">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Location</h3>
                                            <p className="text-purple-600 font-medium">Phnom Penh, Cambodia</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* FAQ Section - Accordion Style */}
                    <div className="mt-12 sm:mt-16">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Common Questions</h2>
                            <p className="text-gray-600">Quick answers to help you get started</p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-4">
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
            </div>
        </WebsiteLayout>
    );
}