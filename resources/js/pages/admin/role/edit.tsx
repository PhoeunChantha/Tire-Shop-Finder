import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleForm from "@/components/roles/RoleForm";
import useRoleForm from "@/hooks/roles/use-roleForm";
import { RoleEditProps } from "@/types";

export default function Edit({ auth, role, permissions = [] }: RoleEditProps) {
    const initialData = {
        name: role.name,
        permissions: role.permissions?.map(p => p.id) || [],
    };

    const { data, setData, submitUpdate, processing, errors } = useRoleForm(initialData);

    return (
        <AppLayout>
            <Head title="Edit Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Role: {role.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RoleForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            permissions={permissions}
                            onSubmit={submitUpdate(role.id)}
                            submitText="Update Role"
                            isEdit={true}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}