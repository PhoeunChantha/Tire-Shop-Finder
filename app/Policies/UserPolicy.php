<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('user-view') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Admin can view any user
        if ($user->hasPermissionTo('user-view') || $user->hasRole('admin')) {
            return true;
        }

        // Users can view their own profile
        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('user-create') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Admin can update any user
        if ($user->hasPermissionTo('user-edit') || $user->hasRole('admin')) {
            return true;
        }

        // Users can update their own profile
        return $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Admin can delete users (except themselves)
        if ($user->hasPermissionTo('user-delete') || $user->hasRole('admin')) {
            return $user->id !== $model->id; // Can't delete yourself
        }

        return false;
    }

    /**
     * Determine whether the user can manage roles for other users.
     */
    public function manageRoles(User $user, User $model): bool
    {
        // Only admin can manage roles
        if ($user->hasPermissionTo('user-manage-roles') || $user->hasRole('admin')) {
            return $user->id !== $model->id; // Can't manage own roles
        }

        return false;
    }

    /**
     * Determine whether the user can impersonate other users.
     */
    public function impersonate(User $user, User $model): bool
    {
        return $user->hasPermissionTo('user-impersonate') && $user->id !== $model->id;
    }
}