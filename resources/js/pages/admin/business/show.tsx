import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DeleteModal from '@/components/DeleteModal';
import { BusinessShowProps } from '@/types';
import {
    Building,
    ArrowLeft,
    MapPin,
    Clock,
    User,
    Calendar,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Settings,
    Plus,
    ImageIcon
} from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

export default function BusinessShow({ auth, business }: BusinessShowProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getStatusBadge = () => {
        if (business.is_vierify) {
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-4 h-4 mr-1" />Verified</Badge>;
        } else {
            return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-4 h-4 mr-1" />Pending Review</Badge>;
        }
    };

    const handleDeleteConfirm = () => {
        setDeleting(true);
        router.delete(`/admin/businesses/${business.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeleting(false);
            },
            onError: () => {
                setDeleting(false);
            },
        });
    };
    const getBusinessImageUrl = (business: any) => {
        if (business.image) {
            return getImageUrl(business.image, 'businesses');
        }
        return null;
    };

    return (
        <AppLayout>
            <Head title={`${business.name} - Business Details`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    {getStatusBadge()}
                                    <span className="text-gray-500">ID: {business.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/admin/businesses/${business.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                            </Link>

                            {!business.is_vierify ? (
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => router.patch(route('businesses.verify', business.id))}
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verify Business
                                </Button>
                            ) : (
                                <Button
                                    variant="destructive"
                                    onClick={() => router.patch(route('businesses.reject', business.id))}
                                >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Revoke Verification
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Business Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="w-5 h-5" />
                                        Business Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Business Name</label>
                                        <p className="text-gray-900 font-medium">{business.name}</p>
                                    </div>

                                    {business.descriptions && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <p className="text-gray-900 mt-1 whitespace-pre-wrap">{business.descriptions}</p>
                                        </div>
                                    )}

                                    {(business.opening_time && business.closing_time) && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Opening Hours</label>
                                            <p className="text-gray-900 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {business.formatted_hours}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Location Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Location Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Province</label>
                                            <p className="text-gray-900">{business.province?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">District</label>
                                            <p className="text-gray-900">{business.district?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Commune</label>
                                            <p className="text-gray-900">{business.commune?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Village</label>
                                            <p className="text-gray-900">{business.village?.name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {(business.latitude && business.longitude) && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Coordinates</label>
                                            <p className="text-gray-900">
                                                Lat: {business.latitude}, Lng: {business.longitude}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Business Image */}
                            {business.image && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Business Image</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                            {getBusinessImageUrl(business) ? (
                                            <img
                                                src={getBusinessImageUrl(business)!}
                                                alt={business.name}
                                                className="w-full max-w-md rounded-lg shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-35 h-35 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Business Services */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="w-5 h-5" />
                                            Services ({business.services?.length || 0})
                                        </CardTitle>
                                        <Link href={route('admin.services.create', business.id)}>
                                            <Button size="sm">
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Service
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {business.services && business.services.length > 0 ? (
                                        <div className="space-y-3">
                                            {business.services.map((service: any) => (
                                                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                                                        {service.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                        )}
                                                        {service.price && (
                                                            <p className="text-sm font-medium text-green-600 mt-1">
                                                                ${service.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('admin.services.edit', service.id)}>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this service?')) {
                                                                    router.delete(route('admin.services.destroy', service.id))
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                        <Badge variant={service.status ? "default" : "secondary"}>
                                                            {service.status ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <h3 className="text-sm font-medium text-gray-900 mb-1">No services added yet</h3>
                                            <p className="text-sm text-gray-600 mb-3">This business hasn't added any services yet.</p>
                                            <Link href={route('admin.services.create', business.id)}>
                                                <Button size="sm">
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add First Service
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Owner Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Business Owner
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Name</label>
                                        <p className="text-gray-900">{business.owner?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-gray-900">{business.owner?.email}</p>
                                    </div>
                                    <div className="pt-2">
                                        <Link href={`/admin/users/${business.created_by}`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                <User className="w-4 h-4 mr-1" />
                                                View User Profile
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status & Dates */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Status & Dates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Verification Status</label>
                                        <div className="mt-1">{getStatusBadge()}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Business Status</label>
                                        <div className="mt-1">
                                            <Badge variant={business.status ? "default" : "secondary"}>
                                                {business.status ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Created Date</label>
                                        <p className="text-gray-900 text-sm">
                                            {new Date(business.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Last Updated</label>
                                        <p className="text-gray-900 text-sm">
                                            {new Date(business.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className='flex flex-row gap-2'>
                                        <Link href={`/admin/businesses/${business.id}/edit`}>
                                            <Button variant="outline" className="w-full">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit Business
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => setDeleteModalOpen(true)}
                                            disabled={deleting}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete Business
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Business"
                description="Are you sure you want to delete this business? This action cannot be undone and will remove all associated data including reviews and settings."
                itemName={business.name}
                confirmText="Delete Business"
                processing={deleting}
            />
        </AppLayout>
    );
}