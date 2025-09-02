<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServicePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view services
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Service $service): bool
    {
        // Admin can view any service
        if ($user->hasPermissionTo('service-view') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can view their own business services
        return $user->id === $service->business->created_by;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Users can create services for their own businesses
        // This will be further validated in the controller to ensure
        // they're creating services for their own business
       return $user->hasPermissionTo('service-create') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Service $service): bool
    {
        // Admin can edit any service
        if ($user->hasPermissionTo('service-edit') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can edit services of their own business
        return $user->id === $service->business->created_by;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Service $service): bool
    {
        // Admin can delete any service
        if ($user->hasPermissionTo('service-delete') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can delete services of their own business
        return $user->id === $service->business->created_by;
    }

    /**
     * Determine whether the user can manage service status.
     */
    public function manageStatus(User $user, Service $service): bool
    {
        // Admin can manage any service status
        if ($user->hasPermissionTo('service-manage-status') || $user->hasRole('admin')) {
            return true;
        }

        // Business owner can manage status of their own business services
        return $user->id === $service->business->created_by;
    }

    /**
     * Determine whether the user can create service for a specific business.
     */
    public function createForBusiness(User $user, $businessId): bool
    {
        // Admin can create services for any business
        if ($user->hasPermissionTo('service-create') || $user->hasRole('admin')) {
            return true;
        }

        // Check if user owns the business
        $business = \App\Models\Business::find($businessId);
        return $business && $user->id === $business->created_by;
    }
}