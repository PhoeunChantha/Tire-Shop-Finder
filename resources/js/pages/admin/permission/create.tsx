import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PermissionForm from "@/components/permissions/PermissionForm";
import usePermissionForm from "@/hooks/permissions/use-permissionForm";

interface CreatePermissionModalProps {
  triggerText?: string;
}

export default function CreatePermissionModal({ 
  triggerText = "Create Permission" 
}: CreatePermissionModalProps) {
  const [open, setOpen] = useState(false);
  const { 
    data, 
    setData, 
    post, 
    processing, 
    errors, 
    reset,
    nameErrors,
    handleNameChange,
    addPermission,
    removePermission
  } = usePermissionForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("permissions.store"), {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
      onError: (errors) => {
        console.log('Create permission errors:', errors);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(); // Reset form when modal closes
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Create New Permission
          </DialogTitle>
          <DialogDescription>
            Create a new permission to control specific actions in the application.
          </DialogDescription>
        </DialogHeader>

        <PermissionForm
          data={data}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitText="Create Permission"
          nameErrors={nameErrors}
          handleNameChange={handleNameChange}
          addPermission={addPermission}
          removePermission={removePermission}
        />
      </DialogContent>
    </Dialog>
  );
}