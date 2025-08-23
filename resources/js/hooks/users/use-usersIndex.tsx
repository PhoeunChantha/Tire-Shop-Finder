import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Shield } from "lucide-react";
import { User } from "@/types";

export default function useUsersIndex() {
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { delete: destroy, processing: deleting } = useForm();

  const handleUserDeleted = () => {
    window.location.reload();
  };

  const openDeleteModal = (user: User) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;

    destroy(route('users.destroy', deletingUser.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeletingUser(null);
        handleUserDeleted();
      },
      onError: (errors) => {
        console.log('Delete errors:', errors);
      }
    });
  };

  // Define actions for each user row
  const getUserActions = (user: User) => [
    {
      key: 'view',
      label: 'View',
      href: route('users.show', user.id),
      variant: 'outline'
    },
    {
      key: 'edit',
      label: 'Edit',
      href: route('users.edit', user.id),
      variant: 'outline'
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: (user: User) => {
        openDeleteModal(user);
      },
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  // Filter configuration for the DataTableFilter component
  const filterConfig = {
    search: {
      enabled: true,
      placeholder: "Search users by name or email...",
      debounce: 300
    },
    perPage: {
      enabled: true,
      default: 10
    },
    quickFilters: [
      {
        key: 'email_verified',
        type: 'select',
        placeholder: 'Email Status',
        icon: Shield,
        options: [
          { value: '', label: 'All Users' },
          { value: '1', label: 'Verified' },
          { value: '0', label: 'Unverified' }
        ]
      }
    ],
    advancedFilters: [
      {
        key: 'created_date',
        type: 'date_range',
        placeholder: 'Registration Date'
      }
    ]
  };

  return {
    deletingUser,
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    handleDeleteConfirm,
    getUserActions,
    filterConfig
  };
}