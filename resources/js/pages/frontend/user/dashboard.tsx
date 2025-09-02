import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import WebsiteLayout from '@/layouts/website-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteModal from '@/components/DeleteModal';
import { Building, MapPin, Clock, Star, Eye, Edit, Wrench, Plus, CheckCircle, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';

export default function UserDashboard({ auth, business }: { auth: any; business?: any }) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const handleDeleteClick = (service: any) => {
        setServiceToDelete(service);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (serviceToDelete) {
            setProcessing(true);
            router.delete(`/businesses/${business.slug}/services/${serviceToDelete.id}`, {
                onFinish: () => {
                    setProcessing(false);
                    setDeleteModalOpen(false);
                    setServiceToDelete(null);
                }
            });
        }
    };
    return (
        <WebsiteLayout>
            <Head title="My Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Welcome back, {auth.user.name}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your tire shop listing
                                </p>
                            </div>
                            {business?.is_vierify && (
                                <Link href={`/tire-shops/${business.slug}`} className="mt-4 sm:mt-0">
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Public Listing
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">{business ? 1 : 0}</h3>
                                <p className="text-sm text-gray-600">Business Listed</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">0</h3>
                                <p className="text-sm text-gray-600">Profile Views</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <Wrench className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">{business?.services?.length || 0}</h3>
                                <p className="text-sm text-gray-600">Services</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <h3 className="text-2xl font-bold text-gray-900">0</h3>
                                <p className="text-sm text-gray-600">Reviews</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    {!business ? (
                        // No Business State
                        <Card className="text-center py-12">
                            <CardContent>
                                <Building className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Create Your Tire Shop Listing
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Get discovered by customers looking for tire services in Cambodia. 
                                    Create your free business listing today.
                                </p>
                                <Link href="/create-business">
                                    <Button size="lg" className="px-8">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Business Listing
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        // Business Overview
                        <div className="space-y-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Building className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                        {business.name}
                                                    </h2>
                                                    <p className="text-gray-600 mb-4">
                                                        {business.descriptions}
                                                    </p>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        {business.is_vierify ? (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Verified & Live
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                Under Review
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-gray-500">
                                                            {business?.services?.length || 0} services
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:ml-6">
                                            <Link href={`/businesses/${business.slug}/edit`}>
                                                <Button variant="outline" className="w-full lg:w-auto">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Services Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Wrench className="w-5 h-5" />
                                                Services ({business?.services?.length || 0})
                                            </span>
                                            <Link href={`/businesses/${business.slug}/services/create`}>
                                                <Button size="sm" variant="outline">
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add Service
                                                </Button>
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {business?.services && business.services.length > 0 ? (
                                            <div className="space-y-3">
                                                {business.services.map((service: any) => (
                                                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                                                            <p className="text-sm text-gray-600">${service.price}</p>
                                                            {service.descriptions && (
                                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{service.descriptions}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <div className={`w-2 h-2 rounded-full ${service.status ? 'bg-green-500' : 'bg-gray-400'}`} title={service.status ? 'Active' : 'Inactive'}></div>
                                                            <div className="flex items-center gap-1">
                                                                <Link href={`/businesses/${business.slug}/services/${service.id}/edit`}>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit service">
                                                                        <Edit className="w-3 h-3" />
                                                                    </Button>
                                                                </Link>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" 
                                                                    onClick={() => handleDeleteClick(service)}
                                                                    title="Delete service"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                                <p className="text-sm">No services added yet</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Star className="w-5 h-5" />
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col space-y-2">
                                        <Link href={`/businesses/${business.slug}/edit`}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Business Details
                                            </Button>
                                        </Link>
                                        <Link href={`/businesses/${business.slug}/services/create`}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add New Service
                                            </Button>
                                        </Link>
                                        {business.is_vierify && (
                                            <Link href={`/tire-shops/${business.slug}`}>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Public Listing
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Service"
                description="Are you sure you want to delete this service? This action cannot be undone and will remove the service from your business listing."
                itemName={serviceToDelete?.name}
                confirmText="Delete Service"
                processing={processing}
            />
        </WebsiteLayout>
    );
}