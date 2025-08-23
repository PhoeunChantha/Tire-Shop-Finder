import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import InputError from "@/components/InputError";
import { Plus, Minus } from "lucide-react";
import { FormEventHandler } from "react";

interface PermissionFormProps {
  onSubmit: FormEventHandler;
  submitText?: string;
  isEdit?: boolean;
  // Hook-based props
  data: {
    name: string[];
  };
  errors: Record<string, any>;
  processing: boolean;
  nameErrors: string[];
  handleNameChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  addPermission: () => void;
  removePermission: (index: number) => void;
}

export default function PermissionForm({
  onSubmit,
  submitText = "Submit",
  isEdit = false,
  // Hook props
  data,
  errors,
  processing,
  nameErrors,
  handleNameChange,
  addPermission,
  removePermission
}: PermissionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {data.name.map((name, index) => (
          <div key={index} className="flex items-start gap-4 permission-item">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`name-${index}`}>
                Permission Name {data.name.length > 1 ? `#${index + 1}` : ''}
              </Label>
              <Input
                id={`name-${index}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e)}
                placeholder="Enter permission name (e.g., user-view, user-create)"
                disabled={processing}
              />
              {nameErrors[index] && (
                <p className="text-sm text-red-600">{nameErrors[index]}</p>
              )}
              <InputError message={errors?.name?.[index]} />
              {index === 0 && (
                <p className="text-xs text-muted-foreground">
                  Spaces will be automatically converted to hyphens and text will be lowercase (e.g., "User View" → "user-view").
                </p>
              )}
            </div>

            {!isEdit && (
              <div className="flex gap-2 mt-6">
                {index === data.name.length - 1 && (
                  <Button
                    type="button"
                    onClick={addPermission}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}

                {data.name.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removePermission(index)}
                    variant="outline"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={processing || data.name.length === 0 || data.name.some(name => !name.trim())}
        >
          {processing ? `${submitText}...` : submitText}
        </Button>
      </div>
    </form>
  );
}