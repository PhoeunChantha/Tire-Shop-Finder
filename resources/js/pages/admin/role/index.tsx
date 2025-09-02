import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shield } from "lucide-react"
import DeleteModal from "@/components/DeleteModal"
import DefaultDataTableFilter from "@/components/DefaultDataTableFilter"
import PaginationWrapper from "@/components/PaginationWrapper"
import useRolesIndex from "@/hooks/roles/use-rolesIndex";
import RolesTable from "@/components/roles/RolesTable"
import CreateRoleModal from "@/pages/admin/role/create"
import EditRoleModal from "@/pages/admin/role/edit"
import { RoleIndexProps } from "@/types";

export default function Index({ auth, roles, permissions, filters }: RoleIndexProps) {
  const {
    editingRole,
    editModalOpen,
    setEditModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    deletingRole,
    getRoleActions,
    deleting,
    handleDeleteConfirm,
    filterConfig
  } = useRolesIndex();

  return (
    <AppLayout>
      <Head title="Roles" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles
              </CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </div>
            <CreateRoleModal 
              permissions={permissions} 
              triggerText="Add Role"
            />
          </CardHeader>
          <CardContent>
            <DefaultDataTableFilter
              filters={filters || {}}
              config={filterConfig}
            />
            <RolesTable
              roles={roles}
              getRoleActions={getRoleActions}
            />
            <PaginationWrapper paginatedData={roles} />
          </CardContent>
        </Card>
      </div>

      {/* Edit Role Modal */}
      <EditRoleModal
        role={editingRole}
        permissions={permissions}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone and will remove all associated permissions."
        itemName={deletingRole?.name}
        confirmText="Delete Role"
        processing={deleting}
      />
    </AppLayout>
  )
}