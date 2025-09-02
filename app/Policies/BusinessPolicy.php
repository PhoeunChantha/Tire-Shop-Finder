<?php

namespace App\Policies;

use App\Models\Business;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BusinessPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view businesses list
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Business $business): bool
    {
        // Admin can view any business
        if ($user->hasPermissionTo('business-view') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can view their own business
        return $user->id === $business->created_by;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('business-create') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Business $business): bool
    {
        // Admin can edit any business
        if ($user->hasPermissionTo('business-edit') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can edit their own business
        return $user->id === $business->created_by;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Business $business): bool
    {
        // Admin can delete any business
        if ($user->hasPermissionTo('business-delete') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can delete their own business
        return $user->id === $business->created_by;
    }

    /**
     * Determine whether the user can verify the business.
     */
    public function verify(User $user, Business $business): bool
    {
        // Only admin can verify businesses
        return $user->hasPermissionTo('business-verify') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can reject/revoke verification of the business.
     */
    public function reject(User $user, Business $business): bool
    {
        // Only admin can reject/revoke business verification
        return $user->hasPermissionTo('business-reject') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can manage business status.
     */
    public function manageStatus(User $user, Business $business): bool
    {
        // Admin can manage any business status
        if ($user->hasPermissionTo('business-manage-status') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can manage their own business status
        return $user->id === $business->created_by;
    }

    /**
     * Determine whether the user can view business analytics.
     */
    public function viewAnalytics(User $user, Business $business): bool
    {
        // Admin can view any business analytics
        if ($user->hasPermissionTo('business-view-analytics') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can view their own business analytics
        return $user->id === $business->created_by;
    }
}