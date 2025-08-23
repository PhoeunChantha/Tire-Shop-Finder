<?php

namespace App\Providers;

use Inertia\Inertia;
use App\Http\Observers\RoleObserver;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Vite;
use App\Http\Observers\PermissionObserver;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Inertia::share([
            'flash' => fn() => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
        // Register observers
        Role::observe(RoleObserver::class);
        Permission::observe(PermissionObserver::class);
    }
}
