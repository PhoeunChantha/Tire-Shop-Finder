import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import InputError from "@/components/InputError";
import { Role } from "@/types";
import { FormEventHandler } from "react";

interface UserFormProps {
  data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    profile: string;
    status: boolean;
    role: string;
  };
  setData: (field: string, value: string | boolean) => void;
  errors: Record<string, string>;
  processing: boolean;
  roles?: Role[];
  onSubmit: FormEventHandler;
  submitText?: string;
  isEdit?: boolean;
}

export default function UserForm({ data, setData, errors, processing, roles = [], onSubmit, submitText = "Submit", isEdit = false }: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
          />
          <InputError message={errors?.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
          />
          <InputError message={errors?.email} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            type="text"
            value={data.first_name}
            onChange={(e) => setData("first_name", e.target.value)}
          />
          <InputError message={errors?.first_name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            type="text"
            value={data.last_name}
            onChange={(e) => setData("last_name", e.target.value)}
          />
          <InputError message={errors?.last_name} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={data.dob}
            onChange={(e) => setData("dob", e.target.value)}
          />
          <InputError message={errors?.dob} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="profile">Profile</Label>
          <Input
            id="profile"
            type="text"
            value={data.profile}
            onChange={(e) => setData("profile", e.target.value)}
            placeholder="Profile/occupation"
          />
          <InputError message={errors?.profile} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={data.address}
          onChange={(e) => setData("address", e.target.value)}
          placeholder="Enter full address"
        />
        <InputError message={errors?.address} />
      </div>

      {!isEdit && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
              />
              <InputError message={errors?.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                required
              />
              <InputError message={errors?.password_confirmation} />
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="role">Assign Role</Label>
          <Select value={data.role} onValueChange={(value) => setData("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.display_name || role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors?.role} />
        </div>

        <div className="grid gap-2">
          <Label>Status</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={data.status}
              onCheckedChange={(checked) => setData("status", !!checked)}
            />
            <Label htmlFor="status">Active User</Label>
          </div>
          <InputError message={errors?.status} />
        </div>
      </div>

      <div className="flex justify-start">
        <Button type="submit" disabled={processing}>{submitText}</Button>
      </div>
    </form>
  );
}
