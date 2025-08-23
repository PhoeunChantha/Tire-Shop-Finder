import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, ArrowLeft } from "lucide-react";
import { RoleShowProps } from "@/types";

export default function Show({ auth, role }: RoleShowProps) {
    // Group permissions by module
    const groupedPermissions = role.permissions.reduce((acc: Record<string, any[]>, permission) => {
        const module = permission.module || 'General';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {});

    return (
        <AppLayout>
            <Head title={`Role: ${role.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={route("roles.index")}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Roles
                            </Button>
                        </Link>
                    </div>
                    <Link href={route("roles.edit", role.id)}>
                        <Button>
                            <Edit className="h-4 w-4" />
                            Edit Role
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            {role.display_name || role.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Role Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Role Name</label>
                                    <p className="text-sm">{role.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                                    <p className="text-sm">{role.display_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Guard</label>
                                    <p className="text-sm">{role.guard_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                                    <p className="text-sm">{new Date(role.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">
                                Permissions ({role.permissions.length})
                            </h3>
                            
                            {Object.keys(groupedPermissions).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(groupedPermissions).map(([module, permissions]) => (
                                        <div key={module} className="border rounded-lg p-4">
                                            <h4 className="font-medium text-sm mb-3 capitalize">
                                                {module} ({permissions.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {permissions.map((permission: any) => (
                                                    <Badge key={permission.id} variant="secondary">
                                                        {permission.display_name || permission.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No permissions assigned to this role.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}