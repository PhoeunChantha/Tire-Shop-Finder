import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import UploadImage from "@/components/ui/upload-image";
import InputError from "@/components/InputError";
import { Role } from "@/types";
import { FormEventHandler } from "react";
import { getImageUrl } from "@/lib/imageHelper";

interface UserFormProps {
  data: any;
  setData: (field: string, value: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  roles?: Role[];
  onSubmit: FormEventHandler;
  submitText?: string;
  isEdit?: boolean;
  currentProfile?: string | null;
}

export default function UserForm({
  data, setData, errors, processing, roles = [],
  onSubmit, submitText = "Submit", isEdit = false, currentProfile = null
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4" encType="multipart/form-data">
      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} />
          <InputError message={errors?.name} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
          <InputError message={errors?.email} />
        </div>
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" type="text" value={data.first_name} onChange={(e) => setData("first_name", e.target.value)} />
          <InputError message={errors?.first_name} />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" type="text" value={data.last_name} onChange={(e) => setData("last_name", e.target.value)} />
          <InputError message={errors?.last_name} />
        </div>
      </div>

      {/* DOB & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={data.dob ? data.dob.slice(0, 10) : ""}
            onChange={(e) => setData("dob", e.target.value)}
          />
          <InputError message={errors?.dob} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
          <InputError message={errors?.phone} />
        </div>
      </div>

      {/* Password fields for create only */}
      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} required />
            <InputError message={errors?.password} />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} required />
            <InputError message={errors?.password_confirmation} />
          </div>
        </div>
      )}

      {/* Role & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Assign Role</Label>
          <Select value={data.role} onValueChange={(value) => setData("role", value)}>
            <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
            <SelectContent>
              {roles.map(role => <SelectItem key={role.id} value={role.name}>{role.display_name || role.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <InputError message={errors?.role} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox checked={!!data.status} onCheckedChange={(checked) => setData("status", !!checked)} id="status" />
          <Label htmlFor="status">Active User</Label>
          <InputError message={errors?.status} />
        </div>
      </div>

      {/* Profile Image & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UploadImage
            id="profile"
            label="Profile Image"
            value={data.profile}
            currentImage={currentProfile ? getImageUrl(currentProfile, "users") : null}
            onChange={(file: File | null) => setData("profile", file)}
            error={errors?.profile}
            previewClassName="w-20 h-20 object-cover rounded-full border"
            maxSize={2}
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" value={data.address} onChange={(e) => setData("address", e.target.value)} placeholder="Enter full address" />
          <InputError message={errors?.address} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>{submitText}</Button>
      </div>
    </form>
  );
}
