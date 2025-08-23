import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InputError from "@/components/InputError";
import { Permission } from "@/types";
import { FormEventHandler } from "react";

interface RoleFormProps {
  permissions: Permission[];
  onSubmit: FormEventHandler;
  submitText?: string;
  isEdit?: boolean;
  // Hook-based props
  data: {
    name: string;
    permissions: number[];
  };
  errors: Record<string, string>;
  processing: boolean;
  nameError: string;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePermissionChange: (permissionId: number, checked: boolean) => void;
  handleModuleCheckboxChange: (groupedPermissions: Record<string, Permission[]>, module: string, checked: boolean) => void;
}

export default function RoleForm({ 
  permissions,
  onSubmit, 
  submitText = "Submit",
  isEdit = false,
  // Hook props
  data,
  errors, 
  processing, 
  nameError,
  handleNameChange,
  handlePermissionChange,
  handleModuleCheckboxChange
}: RoleFormProps) {

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc: Record<string, Permission[]>, permission) => {
    const module = permission.module || 'General';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});


  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          type="text"
          value={data.name}
          onChange={handleNameChange}
          placeholder="Enter role name (e.g., admin, editor)"
          disabled={processing}
          required
        />
        {nameError && (
          <p className="text-sm text-blue-600">{nameError}</p>
        )}
        <InputError message={errors?.name} />
        <p className="text-xs text-muted-foreground">
          Spaces will be automatically converted to hyphens and text will be lowercase (e.g., "Super Admin" → "super-admin")
        </p>
      </div>

      {Object.keys(groupedPermissions).length > 0 && (
        <div className="space-y-4">
          <Label>Permissions</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 items-center border rounded-lg p-4 max-h-64 overflow-y-auto">
            {Object.entries(groupedPermissions).map(([module, perms]) => (
              <div key={module} className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold text-sm text-gray-700 capitalize">
                  <Checkbox
                    id={`permission-${module}`}
                    checked={data.permissions.some(id => perms.some(permission => permission.id === id))}
                    onCheckedChange={(checked) => 
                      handleModuleCheckboxChange(groupedPermissions, module, !!checked)
                    }
                    disabled={processing}
                  />
                  <Label 
                    htmlFor={`permission-${module}`}
                    className="font-semibold text-sm text-black capitalize cursor-pointer"
                  >
                    {module}
                  </Label>
                </h3>
                <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-gray-100">
                  {perms.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={data.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, !!checked)
                        }
                        disabled={processing}
                      />
                      <Label 
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission.display_name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <InputError message={errors?.permissions} />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={processing || !data.name.trim()}
        >
          {processing ? `${submitText}...` : submitText}
        </Button>
      </div>
    </form>
  );
}