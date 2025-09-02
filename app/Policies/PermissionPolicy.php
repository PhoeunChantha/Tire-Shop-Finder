<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Illuminate\Auth\Access\HandlesAuthorization;

class PermissionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('permission-view') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permission-view') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only super-admin can create new permissions
        return $user->hasRole('admin') || $user->hasPermissionTo('permission-create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Permission $permission): bool
    {
        // Only super-admin can edit permissions
        return $user->hasRole('admin') || $user->hasPermissionTo('permission-edit');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Permission $permission): bool
    {
        // Check if permission is in use by roles
        if ($permission->roles()->count() > 0) {
            return false; // Can't delete permission that's assigned to roles
        }

        // Only super-admin can delete permissions
        return $user->hasRole('admin') || $user->hasPermissionTo('permission-delete');
    }

    /**
     * Determine whether the user can sync permissions to roles.
     */
    public function sync(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermissionTo('permission-sync');
    }
}