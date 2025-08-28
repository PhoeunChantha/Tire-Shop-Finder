import AppLayout from '@/layouts/app-layout';
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "@/components/users/UserForm";
import useUserForm from "@/hooks/users/use-userForm";
import { UserCreateProps } from "@/types";

export default function Create({ auth, roles = [] }: UserCreateProps) {
  const { data, setData, submitCreate, processing, errors } = useUserForm();
  return (
    <AppLayout>
      <Head title="Add User" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add a new user</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              data={data}
              setData={setData}
              errors={errors}
              processing={processing}
              roles={roles}
              onSubmit={submitCreate}
              submitText="Create User"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
