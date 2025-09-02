<?php

namespace App\Providers;

use App\Models\Business;
use App\Models\Service;
use App\Models\User;
use App\Policies\BusinessPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\RolePolicy;
use App\Policies\ServicePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        Permission::class => PermissionPolicy::class,
        Business::class => BusinessPolicy::class,
        Service::class => ServicePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Implicitly grant "super-admin" role all permissions
        // This works in the app by using gate-related functions like auth()->user()->can()
        Gate::before(function (User $user, string $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });

        // Define custom gates for common permission checks
        Gate::define('admin-access', function (User $user) {
            return $user->hasRole(['admin', 'super-admin']);
        });

        Gate::define('manage-businesses', function (User $user) {
            return $user->hasPermissionTo('business.manage') || $user->hasRole(['admin', 'super-admin']);
        });

        Gate::define('manage-users', function (User $user) {
            return $user->hasPermissionTo('user.manage') || $user->hasRole(['admin', 'super-admin']);
        });

        Gate::define('manage-roles-permissions', function (User $user) {
            return $user->hasPermissionTo(['role.manage', 'permission.manage']) || $user->hasRole(['admin', 'super-admin']);
        });
    }
}