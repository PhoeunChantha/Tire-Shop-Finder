import React, { useEffect } from "react"
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
import PermissionsTable from "@/components/permissions/PermissionsTable"
import usePermissionsIndex from "@/hooks/permissions/use-permissionsIndex"
import CreatePermissionModal from "@/pages/admin/permission/create"
import PermissionForm from "@/components/permissions/PermissionForm"
import usePermissionForm from "@/hooks/permissions/use-permissionForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PermissionIndexProps } from "@/types";

export default function Index({ auth, permissions, filters }: PermissionIndexProps) {
  const {
    editingPermission,
    editModalOpen,
    setEditModalOpen,
    deletingPermission,
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    handleDeleteConfirm,
    getPermissionActions,
    filterConfig
  } = usePermissionsIndex()

  const editInitialData = editingPermission ? {
    name: [editingPermission.name],
  } : { name: [''] };

  const { 
    data: editData, 
    setData: setEditData, 
    put, 
    processing: editProcessing, 
    errors: editErrors,
    reset: resetEditForm,
    nameErrors: editNameErrors,
    handleNameChange: editHandleNameChange,
    addPermission: editAddPermission,
    removePermission: editRemovePermission
  } = usePermissionForm(editInitialData);

  useEffect(() => {
    if (editingPermission && editModalOpen) {
      setEditData('name', [editingPermission.name]);
    }
  }, [editingPermission, editModalOpen]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPermission) return;
    
    put(route("permissions.update", editingPermission.id), {
      onSuccess: () => {
        setEditModalOpen(false);
        resetEditForm();
      },
    });
  };


  return (
    <AppLayout>
      <Head title="Permissions" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>Manage user permissions</CardDescription>
            </div>
            <CreatePermissionModal 
              triggerText="Add Permission"
            />
          </CardHeader>
          <CardContent>
            <DefaultDataTableFilter
              filters={filters || {}}
              config={filterConfig}
            />
            <PermissionsTable
              permissions={permissions}
              getPermissionActions={getPermissionActions}
            />
            <PaginationWrapper paginatedData={permissions} />
          </CardContent>
        </Card>
      </div>

      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Permission"
        description="Are you sure you want to delete this permission? This action cannot be undone."
        itemName={deletingPermission?.name}
        confirmText="Delete Permission"
        processing={deleting}
      />

      {editingPermission && editModalOpen && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Edit Permission: {editingPermission.name}
              </DialogTitle>
              <DialogDescription>
                Update the permission details to modify access controls.
              </DialogDescription>
            </DialogHeader>
            
            <PermissionForm
              data={editData}
              errors={editErrors}
              processing={editProcessing}
              onSubmit={handleEditSubmit}
              submitText="Update Permission"
              isEdit={true}
              nameErrors={editNameErrors}
              handleNameChange={editHandleNameChange}
              addPermission={editAddPermission}
              removePermission={editRemovePermission}
            />
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  )
}