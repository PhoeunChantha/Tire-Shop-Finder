import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar, Shield, ShieldCheck, User as UserIcon } from "lucide-react";
import ActionButtons from "@/components/action-button";
import { PaginatedData, User } from "@/types";
import { getImageUrl } from "@/lib/imageHelper";

interface UsersTableProps {
  users: PaginatedData<User>;
  getUserActions: (user: User) => Array<{
    key: string;
    label: string;
    href?: string;
    onClick?: (user: User) => void;
    variant?: string;
    className?: string;
  }>;
}

export default function UsersTable({ users, getUserActions }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data?.length ? (
            users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.profile ? getImageUrl(user.profile, "users") : undefined}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.first_name && user.last_name && (
                        <div className="text-sm text-muted-foreground">
                          {user.first_name} {user.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.email_verified_at ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-500">Unverified</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <ActionButtons
                    actions={getUserActions(user)}
                    item={user}
                    layout="inline"
                    maxInline={2}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}