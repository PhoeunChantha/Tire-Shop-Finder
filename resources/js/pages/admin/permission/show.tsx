import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, ArrowLeft } from "lucide-react";
import { PermissionShowProps } from "@/types";

export default function Show({ auth, permission }: PermissionShowProps) {
    return (
        <AppLayout>
            <Head title={`Permission: ${permission.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={route("permissions.index")}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Permissions
                            </Button>
                        </Link>
                    </div>
                    <Link href={route("permissions.edit", permission.id)}>
                        <Button>
                            <Edit className="h-4 w-4" />
                            Edit Permission
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            {permission.display_name || permission.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Permission Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Permission Name</label>
                                    <p className="text-sm">{permission.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                                    <p className="text-sm">{permission.display_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Module</label>
                                    <p className="text-sm">
                                        {permission.module ? (
                                            <Badge variant="secondary">{permission.module}</Badge>
                                        ) : (
                                            'General'
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Guard</label>
                                    <p className="text-sm">{permission.guard_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                                    <p className="text-sm">{new Date(permission.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                    <p className="text-sm">{new Date(permission.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}