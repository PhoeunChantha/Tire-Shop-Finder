import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Permission } from "@/types";

interface RoleFormData {
  name: string;
  permissions: number[];
}

export default function useRoleForm(initialData: Partial<RoleFormData> = {}) {
  const [nameError, setNameError] = useState("");

  const { data, setData, post, put, processing, errors, reset } = useForm<RoleFormData>({
    name: "",
    permissions: [],
    ...initialData,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Auto-format: convert spaces to hyphens and make lowercase
    const formattedValue = value.toLowerCase().replace(/\s+/g, '-');
    
    // Show formatting feedback
    if (value !== formattedValue) {
      setNameError("Auto-formatted to: " + formattedValue);
    } else {
      setNameError("");
    }
    
    setData('name', formattedValue);
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setData('permissions', [...data.permissions, permissionId]);
    } else {
      setData('permissions', data.permissions.filter(id => id !== permissionId));
    }
  };

  const handleModuleCheckboxChange = (groupedPermissions: Record<string, Permission[]>, module: string, checked: boolean) => {
    const modulePermissions = groupedPermissions[module] || [];
    const modulePermissionIds = modulePermissions.map(p => p.id);
    
    if (checked) {
      // Add all module permissions (avoid duplicates)
      const newPermissions = [...new Set([...data.permissions, ...modulePermissionIds])];
      setData('permissions', newPermissions);
    } else {
      // Remove all module permissions
      const newPermissions = data.permissions.filter(id => !modulePermissionIds.includes(id));
      setData('permissions', newPermissions);
    }
  };

  const submitCreate: FormEventHandler = (e) => {
    e.preventDefault();
    setNameError("");
    
    post(route("roles.store"), {
      onSuccess: () => {
        reset();
        setNameError("");
      },
    });
  };

  const submitUpdate = (roleId: number): FormEventHandler => (e) => {
    e.preventDefault();
    setNameError("");
    
    put(route("roles.update", roleId), {
      onSuccess: () => {
        setNameError("");
      },
    });
  };

  return { 
    data, 
    setData,
    post,
    put,
    processing, 
    errors,
    reset,
    nameError,
    handleNameChange,
    handlePermissionChange,
    handleModuleCheckboxChange,
    submitCreate, 
    submitUpdate 
  };
}
