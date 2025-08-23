import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Role } from "@/types";

export default function useRolesIndex() {
   const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { delete: destroy, processing: deleting } = useForm()

  const handleRoleCreated = () => {
    // Let Inertia handle the navigation naturally
  }

  const handleRoleUpdated = () => {
    // Let Inertia handle the navigation naturally
  }

  const handleRoleDeleted = () => {
    // Let Inertia handle the navigation naturally
  }

  const openEditModal = (role: Role) => {
    setEditingRole(role)
    setEditModalOpen(true)
  }

  const openDeleteModal = (role: Role) => {
    setDeletingRole(role)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingRole) return

    destroy(route('roles.destroy', deletingRole.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false)
        setDeletingRole(null)
        handleRoleDeleted()
      },
      onError: (errors) => {
        console.log('Delete errors:', errors)
      }
    })
  }

  const getRoleActions = (role: Role) => [
    {
      key: 'edit',
      label: 'Edit',
      onClick: (role: Role) => {
        openEditModal(role)
      },
      variant: 'outline'
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: (role: Role) => {
        openDeleteModal(role)
      },
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700',
      // disabled: role.name === 'super-admin'
    }
  ]

  // Filter configuration for the DataTableFilter component
  const filterConfig = {
    search: {
      enabled: true,
      placeholder: "Search roles by name...",
      debounce: 300
    },
    perPage: {
      enabled: true,
      default: 10
    }
  }

  return {
    editingRole,
    setEditingRole,
    editModalOpen,
    setEditModalOpen,
    deletingRole,
    setDeletingRole,
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    handleDeleteConfirm,
    handleRoleCreated,
    handleRoleUpdated,
    getRoleActions,
    filterConfig
  };
}