import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Shield } from "lucide-react";
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
import { Permission } from "@/types";

interface EditPermissionModalProps {
  permission: Permission;
  triggerText?: string;
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
}

export default function EditPermissionModal({ 
  permission,
  triggerText = "Edit",
  variant = "outline"
}: EditPermissionModalProps) {
  const [open, setOpen] = useState(false);
  
  const initialData = {
    name: permission.name,
    module: permission.module || '',
  };

  const { data, setData, put, processing, errors, reset } = usePermissionForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("permissions.update", permission.id), {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(initialData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" onClick={() => setOpen(true)}>
          <Edit className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Edit Permission: {permission.name}
          </DialogTitle>
          <DialogDescription>
            Update the permission details to modify access controls.
          </DialogDescription>
        </DialogHeader>

        <PermissionForm
          data={data}
          setData={setData}
          errors={errors}
          processing={processing}
          onSubmit={handleSubmit}
          submitText="Update Permission"
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}