import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import ActionButtons from "@/components/action-button";
import { PaginatedData, Permission } from "@/types";

interface PermissionAction {
  key: string;
  label: string;
  href?: string | ((item: any) => string);
  onClick?: (item?: any) => void;
  variant?: string;
  className?: string;
  disabled?: boolean;
}

interface PermissionsTableProps {
  permissions: PaginatedData<Permission & { roles?: any[] }>;
  getPermissionActions: (permission: Permission) => PermissionAction[];
  visibleColumns?: string[];
}

export default function PermissionsTable({ permissions, getPermissionActions, visibleColumns = ['name', 'actions'] }: PermissionsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {visibleColumns.includes('name') && <TableHead>Permission Name</TableHead>}
                        {visibleColumns.includes('module') && <TableHead>Module</TableHead>}
                        {visibleColumns.includes('roles') && <TableHead>Assigned Roles</TableHead>}
                        {visibleColumns.includes('actions') && <TableHead className="w-[100px]">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.data?.length ? (
                        permissions.data.map((permission) => (
                            <TableRow key={permission.id}>
                                {visibleColumns.includes('name') && (
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            {permission.display_name || permission.name}
                                        </div>
                                    </TableCell>
                                )}
                                {visibleColumns.includes('module') && (
                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs">
                                            {permission.module || 'General'}
                                        </Badge>
                                    </TableCell>
                                )}
                                {visibleColumns.includes('roles') && (
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {permission.roles && permission.roles.length > 0 ? (
                                                permission.roles.slice(0, 3).map((role) => (
                                                    <Badge key={role.id} variant="outline" className="text-xs">
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="outline" className="text-xs">
                                                    No roles assigned
                                                </Badge>
                                            )}
                                            {permission.roles && permission.roles.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{permission.roles.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                                {visibleColumns.includes('actions') && (
                                    <TableCell>
                                        <ActionButtons
                                            actions={getPermissionActions(permission)}
                                            item={permission}
                                            layout="dropdown"
                                            maxInline={1}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                                No permissions found. Create your first permission to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}