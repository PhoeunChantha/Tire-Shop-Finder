import AppLayout from '@/layouts/app-layout';
import { Head, Link } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import DefaultDataTableFilter from "@/components/DefaultDataTableFilter";
import PaginationWrapper from "@/components/PaginationWrapper";
import DeleteModal from "@/components/DeleteModal";
import UsersTable from "@/components/users/UsersTable";
import useUsersIndex from "@/hooks/users/use-usersIndex";
import { UserIndexProps } from "@/types";

export default function Index({ auth, users, filters }: UserIndexProps) {
  const {
    deletingUser,
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    handleDeleteConfirm,
    getUserActions,
    filterConfig
  } = useUsersIndex();

  return (
    <AppLayout>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage your application users</CardDescription>
            </div>
            <Link href={route("users.create")}>
              <Button>
                <UserPlus className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <DefaultDataTableFilter
              filters={filters || {}}
              config={filterConfig}
            />
            <UsersTable users={users} getUserActions={getUserActions} />
            <PaginationWrapper paginatedData={users} />
          </CardContent>
        </Card>
      </div>

      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
        itemName={deletingUser?.name}
        confirmText="Delete User"
        processing={deleting}
      />
    </AppLayout>
  );
}