import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RoleForm from "@/components/roles/RoleForm";
import useRoleForm from "@/hooks/roles/use-roleForm";
import { Permission, Role } from "@/types";

interface EditRoleModalProps {
  role: Role | null;
  permissions: Permission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditRoleModal({ 
  role, 
  permissions, 
  open, 
  onOpenChange 
}: EditRoleModalProps) {
    const initialData = role ? {
        name: role.name,
        permissions: role.permissions?.map(p => p.id) || [],
    } : { name: '', permissions: [] };

    const { 
        data, 
        setData, 
        put, 
        processing, 
        errors, 
        reset,
        nameError,
        handleNameChange,
        handlePermissionChange,
        handleModuleCheckboxChange
    } = useRoleForm(initialData);

    // Update form data when role changes
    useEffect(() => {
        if (role && open) {
            setData({
                name: role.name,
                permissions: role.permissions?.map(p => p.id) || [],
            });
        }
    }, [role, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) return;

        put(route("roles.update", role.id), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    if (!role) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Edit Role: {role.name}
                    </DialogTitle>
                    <DialogDescription>
                        Update the role and modify permissions to control user access.
                    </DialogDescription>
                </DialogHeader>
                <RoleForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    permissions={permissions}
                    onSubmit={handleSubmit}
                    submitText="Update Role"
                    isEdit={true}
                    nameError={nameError}
                    handleNameChange={handleNameChange}
                    handlePermissionChange={handlePermissionChange}
                    handleModuleCheckboxChange={handleModuleCheckboxChange}
                />
            </DialogContent>
        </Dialog>
    );
}