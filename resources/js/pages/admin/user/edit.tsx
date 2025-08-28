// resources/js/Pages/Users/Edit.tsx
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "@/components/users/UserForm";
import useUserForm from "@/hooks/users/use-userForm";
import { UserEditProps } from "@/types";

export default function Edit({ auth, user, roles = [] }: UserEditProps) {
  const initialData = {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone?.toString() || "",
    password: "",
    password_confirmation: "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    dob: user.dob || "",
    address: user.address || "",
    profile: null,
    status: Boolean(user.status),
    role: user.roles?.[0]?.name || "",
  };

  const { data, setData, submitUpdate, processing, errors, } = useUserForm(initialData);

  return (
    <AppLayout>
      <Head title="Edit User" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Card>
          <CardHeader><CardTitle>Edit User</CardTitle></CardHeader>
          <CardContent>
            <UserForm
              data={data}
              setData={setData}
              errors={errors}
              processing={processing}
              roles={roles}
              onSubmit={submitUpdate(user.id)}
              submitText="Update User"
              isEdit
              currentProfile={typeof user.profile === "string" ? user.profile : ""}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
