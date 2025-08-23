import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, Users } from "lucide-react"
import ActionButtons from "@/components/action-button";
import { PaginatedData, Role } from "@/types";

interface RolesTableProps {
  roles: PaginatedData<Role & { permissions?: Permission[], users?: any[] }>;
  getRoleActions: (role: Role) => Array<{
    key: string;
    label: string;
    href?: string;
    onClick?: (role: Role) => void;
    variant?: string;
    className?: string;
  }>;
}

interface Permission {
  id: number;
  name: string;
  display_name: string;
}

export default function RolesTable({ roles, getRoleActions }: RolesTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.data?.length ? (
                        roles.data.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        {role.display_name || role.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions && role.permissions.length > 0 ? (
                                            role.permissions.slice(0, 3).map((permission) => (
                                                <Badge key={permission.id} variant="secondary" className="text-xs">
                                                    {permission.display_name || permission.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Badge variant="outline" className="text-xs">
                                                No permissions
                                            </Badge>
                                        )}
                                        {role.permissions && role.permissions.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{role.permissions.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {role.users?.length || 0} users
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <ActionButtons
                                        actions={getRoleActions(role)}
                                        item={role}
                                        layout="dropdown"
                                        maxInline={1}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No roles found. Create your first role to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}