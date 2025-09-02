<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('role-view') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('role-view') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('role-create') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        // Prevent editing super-admin role unless user is super-admin
        if ($role->name === 'admin' && !$user->hasRole('admin')) {
            return false;
        }

        return $user->hasPermissionTo('role-edit') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): bool
    {
        // Prevent deleting super-admin role
        if ($role->name === 'admin') {
            return false;
        }

        // Prevent deleting admin role unless user is super-admin
        if ($role->name === 'admin' && !$user->hasRole('admin')) {
            return false;
        }

        // Check if role is in use
        if ($role->users()->count() > 0) {
            return false; // Can't delete role that's assigned to users
        }

        return $user->hasPermissionTo('role-delete') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can assign permissions to the role.
     */
    public function assignPermissions(User $user, Role $role): bool
    {
        // Prevent modifying admin role permissions unless user is admin
        if ($role->name === 'admin' && !$user->hasRole('admin')) {
            return false;
        }

        return $user->hasPermissionTo('role-assign-permissions') || $user->hasRole('admin');
    }
}