import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoleForm from "@/components/roles/RoleForm";
import useRoleForm from "@/hooks/roles/use-roleForm";
import { Permission } from "@/types";

interface CreateRoleModalProps {
  permissions: Permission[];
  triggerText?: string;
}

export default function CreateRoleModal({ 
  permissions, 
  triggerText = "Create Role" 
}: CreateRoleModalProps) {
  const [open, setOpen] = useState(false);
  const { 
    data, 
    setData, 
    post, 
    processing, 
    errors, 
    reset,
    nameError,
    handleNameChange,
    handlePermissionChange,
    handleModuleCheckboxChange
  } = useRoleForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("roles.store"), {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Create New Role
          </DialogTitle>
          <DialogDescription>
            Create a new role and assign permissions to control user access.
          </DialogDescription>
        </DialogHeader>

        <RoleForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          permissions={permissions}
          onSubmit={handleSubmit}
          submitText="Create Role"
          nameError={nameError}
          handleNameChange={handleNameChange}
          handlePermissionChange={handlePermissionChange}
          handleModuleCheckboxChange={handleModuleCheckboxChange}
        />
      </DialogContent>
    </Dialog>
  );
}