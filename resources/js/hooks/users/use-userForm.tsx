import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function useUserForm(initialData = {}) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    dob: "",
    address: "",
    phone: "",
    profile: "",
    status: false,
    role: "",
    ...initialData,
  });

  const submitCreate: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("users.store"), {
      onSuccess: () => reset(),
    });
  };

  const submitUpdate = (userId: number): FormEventHandler => (e) => {
    e.preventDefault();
    post(`${route("users.update", userId)}?_method=PUT`);
  };

  return { 
    data, 
    setData, 
    processing, 
    errors, 
    submitCreate, 
    submitUpdate 
  };
}
