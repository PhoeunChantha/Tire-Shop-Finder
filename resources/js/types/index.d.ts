import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    first_name?: string;
    last_name?: string;
    dob?: string;
    address?: string;
    profile?: string;
    status: boolean;
    roles?: Role[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    display_name?: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: number;
    name: string;
    display_name?: string;
    module?: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface UserIndexProps {
    auth: Auth;
    users: PaginatedData<User>;
    filters: {
        search?: string;
        email_verified?: string;
        created_date_start?: string;
        created_date_end?: string;
        per_page?: number;
        page?: number;
    };
}

export interface UserCreateProps {
    auth: Auth;
    roles: Role[];
}

export interface UserEditProps {
    auth: Auth;
    user: User;
    roles: Role[];
}

export interface RoleIndexProps {
    auth: Auth;
    roles: PaginatedData<Role>;
    permissions: Permission[];
    filters: {
        search?: string;
        per_page?: number;
        page?: number;
    };
}

export interface RoleCreateProps {
    auth: Auth;
    permissions: Permission[];
}

export interface RoleEditProps {
    auth: Auth;
    role: Role & { permissions: Permission[] };
    permissions: Permission[];
}

export interface RoleShowProps {
    auth: Auth;
    role: Role & { permissions: Permission[] };
}

export interface PermissionIndexProps {
    auth: Auth;
    permissions: PaginatedData<Permission>;
    filters: {
        search?: string;
        per_page?: number;
        page?: number;
    };
}

export interface PermissionCreateProps {
    auth: Auth;
}

export interface PermissionEditProps {
    auth: Auth;
    permission: Permission;
}

export interface PermissionShowProps {
    auth: Auth;
    permission: Permission;
}

export interface Province {
    id: number;
    name: string;
    code?: string;
    created_at: string;
    updated_at: string;
}

export interface District {
    id: number;
    name: string;
    code?: string;
    province_id: number;
    created_at: string;
    updated_at: string;
}

export interface Commune {
    id: number;
    name: string;
    code?: string;
    district_id: number;
    created_at: string;
    updated_at: string;
}

export interface Village {
    id: number;
    name: string;
    code?: string;
    commune_id: number;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: number;
    name: string;
    price: number;
    descriptions?: string;
    status: boolean;
    image?: string;
    icon?: string;
    bussiness_id: number;
    created_at: string;
    updated_at: string;
}

export interface Business {
    id: number;
    name: string;
    descriptions?: string;
    image?: string;
    created_by: number;
    latitude?: string;
    longitude?: string;
    province_id?: number;
    district_id?: number;
    commune_id?: number;
    village_id?: number;
    status: boolean;
    is_vierify?: boolean;
    opening_time?: string;
    closing_time?: string;
    formatted_hours?: string;
    services?: Service[];
    created_at: string;
    updated_at: string;
    owner?: User;
    province?: Province;
    district?: District;
    commune?: Commune;
    village?: Village;
}

export interface BusinessCreateProps {
    auth: Auth;
    provinces: Province[];
}

export interface BusinessIndexProps {
    auth: Auth;
    businesses: PaginatedData<Business>;
    filters: {
        search?: string;
        status?: string;
        province_id?: string;
        per_page?: number;
        page?: number;
    };
    provinces: Province[];
}

export interface BusinessShowProps {
    auth: Auth;
    business: Business;
}

export interface BusinessEditProps {
    auth: Auth;
    business: Business;
    provinces: Province[];
}
