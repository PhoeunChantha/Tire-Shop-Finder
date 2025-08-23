import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Permission } from "@/types";

interface PermissionAction {
  key: string;
  label: string;
  href?: string | ((item: any) => string);
  onClick?: (item?: any) => void;
  variant?: string;
  className?: string;
  disabled?: boolean;
}

export default function usePermissionsIndex() {
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { delete: destroy, processing: deleting } = useForm()

  const handlePermissionCreated = () => {
    // Let Inertia handle the navigation naturally
  }

  const handlePermissionUpdated = () => {
    // Let Inertia handle the navigation naturally
  }

  const handlePermissionDeleted = () => {
    // Let Inertia handle the navigation naturally
  }

  const openEditModal = (permission: Permission) => {
    setEditingPermission(permission)
    setEditModalOpen(true)
  }

  const openDeleteModal = (permission: Permission) => {
    setDeletingPermission(permission)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingPermission) return

    destroy(route('permissions.destroy', deletingPermission.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false)
        setDeletingPermission(null)
        handlePermissionDeleted()
      },
      onError: (errors) => {
        console.log('Delete errors:', errors)
      }
    })
  }

  const getPermissionActions = (permission: Permission): PermissionAction[] => [
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => openEditModal(permission),
      variant: 'outline'
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => openDeleteModal(permission),
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700',
      // disabled: permission.name === 'super-admin'
    }
  ]

  // Filter configuration for the DataTableFilter component
  const filterConfig = {
    search: {
      enabled: true,
      placeholder: "Search permissions by name...",
      debounce: 300
    },
    perPage: {
      enabled: true,
      default: 10
    }
  }

  return {
    editingPermission,
    setEditingPermission,
    editModalOpen,
    setEditModalOpen,
    deletingPermission,
    setDeletingPermission,
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    handleDeleteConfirm,
    handlePermissionCreated,
    handlePermissionUpdated,
    getPermissionActions,
    filterConfig
  };
}