import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface PermissionFormData {
  name: string[];
}

export default function usePermissionForm(initialData: Partial<PermissionFormData> = {}) {
  const [nameErrors, setNameErrors] = useState<string[]>([]);

  const { data, setData, post, put, processing, errors, reset } = useForm<PermissionFormData>({
    name: [""],
    ...initialData,
  });

  const handleNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Auto-format: convert spaces to hyphens and make lowercase
    const formattedValue = value.toLowerCase().replace(/\s+/g, '-');

    const updatedNames = [...data.name];
    updatedNames[index] = formattedValue;

    const updatedNameErrors = [...nameErrors];
    if (value !== formattedValue) {
      updatedNameErrors[index] = "Auto-formatted to: " + formattedValue;
    } else {
      updatedNameErrors[index] = "";
    }

    setData('name', updatedNames);
    setNameErrors(updatedNameErrors);
  };

  const addPermission = () => {
    setData('name', [...data.name, '']);
    setNameErrors([...nameErrors, '']);
  };

  const removePermission = (index: number) => {
    const updatedNames = data.name.filter((_, i) => i !== index);
    const updatedErrors = nameErrors.filter((_, i) => i !== index);

    setData('name', updatedNames);
    setNameErrors(updatedErrors);
  };


  const submitCreate: FormEventHandler = (e) => {
    e.preventDefault();
    setNameErrors([]);
    
    post(route("permissions.store"), {
      onSuccess: () => {
        reset();
        setNameErrors([]);
      },
    });
  };

  const submitUpdate = (permissionId: number): FormEventHandler => (e) => {
    e.preventDefault();
    setNameErrors([]);
    
    put(route("permissions.update", permissionId), {
      onSuccess: () => {
        setNameErrors([]);
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
    nameErrors,
    handleNameChange,
    addPermission,
    removePermission,
    submitCreate, 
    submitUpdate 
  };
}