import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Business, Service } from '@/types';
import { Building, Wrench, ArrowLeft } from 'lucide-react';

interface AdminServiceEditProps {
    service: Service;
    business: Business;
}

export default function AdminServiceEdit({ service, business }: AdminServiceEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || '',
        price: service.price || '',
        descriptions: service.descriptions || '',
        status: service.status || true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.services.update', service.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Service - ${service.name} - ${business.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
                        <p className="text-gray-600">{business.name}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="w-5 h-5" />
                                Service Details
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Update service information and pricing.
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Service Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g., Tire Installation, Wheel Balancing"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price">
                                            Price (USD) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            className={errors.price ? 'border-red-500' : ''}
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-500">{errors.price}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descriptions">Service Description</Label>
                                    <Textarea
                                        id="descriptions"
                                        value={data.descriptions}
                                        onChange={(e) => setData('descriptions', e.target.value)}
                                        placeholder="Describe what this service includes..."
                                        rows={4}
                                        className={errors.descriptions ? 'border-red-500' : ''}
                                    />
                                    {errors.descriptions && (
                                        <p className="text-sm text-red-500">{errors.descriptions}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Active Status</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Enable or disable this service
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.status}
                                        onCheckedChange={(checked) => setData('status', checked)}
                                    />
                                </div>

                                <div className="flex justify-between pt-6 border-t">
                                    <Link href={route('businesses.show', business.id)}>
                                        <Button type="button" variant="outline">
                                            <ArrowLeft className="w-4 h-4 mr-1" />
                                            Back to Business
                                        </Button>
                                    </Link>
                                    <div className="flex space-x-4">
                                        <Button type="button" variant="outline" onClick={() => router.get(route('businesses.show', business.id))}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Service'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}