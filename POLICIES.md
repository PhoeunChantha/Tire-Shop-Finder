# Laravel Policies Implementation

This document explains the authorization policies implemented for the Tire Shop Finder Cambodia application.

## Overview

Policies have been created for the following models:
- **User** - User management and profile access
- **Role** - Role management with Spatie Permission
- **Permission** - Permission management (restricted to super-admin)
- **Business** - Business directory management
- **Service** - Business services management

## Policy Files Created

- `app/Policies/UserPolicy.php`
- `app/Policies/RolePolicy.php` 
- `app/Policies/PermissionPolicy.php`
- `app/Policies/BusinessPolicy.php`
- `app/Policies/ServicePolicy.php`
- `app/Providers/AuthServiceProvider.php`

## How to Use Policies in Controllers

### Method 1: Using authorize() helper

```php
<?php

namespace App\Http\Controllers\Backends;

use App\Http\Controllers\Controller;
use App\Models\Business;

class BusinessController extends Controller
{
    public function index()
    {
        // Check if user can view any businesses
        $this->authorize('viewAny', Business::class);
        
        // Your existing logic here
    }

    public function show(Business $business)
    {
        // Check if user can view this specific business
        $this->authorize('view', $business);
        
        return Inertia::render('admin/business/show', [
            'business' => $business
        ]);
    }

    public function edit(Business $business)
    {
        // Check if user can update this business
        $this->authorize('update', $business);
        
        return Inertia::render('admin/business/edit', [
            'business' => $business
        ]);
    }

    public function update(BusinessUpdateRequest $request, Business $business)
    {
        $this->authorize('update', $business);
        
        // Update logic here
    }

    public function destroy(Business $business)
    {
        $this->authorize('delete', $business);
        
        $business->delete();
        return redirect()->route('businesses.index');
    }

    public function verify(Business $business)
    {
        // Check if user can verify businesses
        $this->authorize('verify', $business);
        
        $business->update(['is_vierify' => true]);
        return back();
    }

    public function reject(Business $business)
    {
        $this->authorize('reject', $business);
        
        $business->update(['is_vierify' => false]);
        return back();
    }
}
```

### Method 2: Using Gate facade in Blade/Inertia

```php
// In your controller, pass authorization data to frontend
public function show(Business $business)
{
    return Inertia::render('admin/business/show', [
        'business' => $business,
        'can' => [
            'update' => auth()->user()->can('update', $business),
            'delete' => auth()->user()->can('delete', $business),
            'verify' => auth()->user()->can('verify', $business),
            'reject' => auth()->user()->can('reject', $business),
        ]
    ]);
}
```

### Method 3: Using can() helper

```php
public function someMethod(Business $business)
{
    if (auth()->user()->can('update', $business)) {
        // User can update this business
    }
    
    if (auth()->user()->can('verify', $business)) {
        // User can verify this business
    }
}
```

## Authorization Rules Summary

### UserPolicy
- **viewAny**: Admin or has `user.view` permission
- **view**: Admin, has permission, or viewing own profile
- **update**: Admin, has permission, or updating own profile
- **delete**: Admin or has permission (can't delete self)
- **manageRoles**: Admin or has permission (can't manage own roles)

### RolePolicy  
- **viewAny/view**: Admin or has `role.view` permission
- **create**: Admin or has `role.create` permission
- **update**: Admin or has permission (can't edit super-admin unless super-admin)
- **delete**: Admin or has permission (protects system roles and roles in use)
- **assignPermissions**: Admin or has permission (protects super-admin role)

### PermissionPolicy
- **viewAny/view**: Admin or has `permission.view` permission
- **create/update/delete**: Super-admin only or specific permission
- **delete**: Also checks if permission is in use by roles

### BusinessPolicy
- **viewAny**: All authenticated users
- **view**: Admin, has permission, or business owner
- **create**: All authenticated users
- **update**: Admin, has permission, or business owner
- **delete**: Admin, has permission, or business owner
- **verify/reject**: Admin only or has specific permission
- **manageStatus**: Admin, has permission, or business owner

### ServicePolicy
- **viewAny**: All authenticated users
- **view**: Admin, has permission, or business owner
- **create**: All users (validated in controller for business ownership)
- **update/delete**: Admin, has permission, or business owner
- **createForBusiness**: Admin or business owner

## Custom Gates

The following custom gates are available:

```php
// Check admin access
if (Gate::allows('admin-access')) {
    // User is admin or super-admin
}

// Check business management permissions
if (Gate::allows('manage-businesses')) {
    // User can manage businesses
}

// Check user management permissions  
if (Gate::allows('manage-users')) {
    // User can manage users
}

// Check roles/permissions management
if (Gate::allows('manage-roles-permissions')) {
    // User can manage roles and permissions
}
```

## Frontend Usage (React/TypeScript)

In your React components, you can use the authorization data passed from controllers:

```typescript
interface BusinessShowProps {
    business: Business;
    can: {
        update: boolean;
        delete: boolean;
        verify: boolean;
        reject: boolean;
    };
}

export default function BusinessShow({ business, can }: BusinessShowProps) {
    return (
        <div>
            {can.update && (
                <Button href={`/businesses/${business.id}/edit`}>
                    Edit Business
                </Button>
            )}
            
            {can.verify && !business.is_vierify && (
                <Button onClick={() => verifyBusiness()}>
                    Verify Business
                </Button>
            )}
            
            {can.delete && (
                <Button variant="destructive" onClick={() => deleteBusiness()}>
                    Delete Business
                </Button>
            )}
        </div>
    );
}
```

## Middleware Integration

You can also use policies with middleware:

```php
// In routes/web.php
Route::middleware('can:manage-businesses')->group(function () {
    Route::get('/admin/businesses', [BusinessController::class, 'index']);
    Route::post('/admin/businesses', [BusinessController::class, 'store']);
});

// For specific model instances
Route::get('/businesses/{business}/edit', [BusinessController::class, 'edit'])
    ->middleware('can:update,business');
```

## Required Permissions

Make sure these permissions exist in your database:

### User Permissions
- `user.view`, `user.create`, `user.edit`, `user.delete`
- `user.manage-roles`, `user.impersonate`

### Role Permissions  
- `role.view`, `role.create`, `role.edit`, `role.delete`
- `role.assign-permissions`

### Permission Permissions
- `permission.view`, `permission.create`, `permission.edit`, `permission.delete`
- `permission.sync`

### Business Permissions
- `business.view`, `business.edit`, `business.delete`
- `business.verify`, `business.reject`, `business.manage-status`
- `business.view-analytics`

### Service Permissions
- `service.view`, `service.create`, `service.edit`, `service.delete`
- `service.manage-status`

## Testing Policies

You can test policies in your application:

```php
// Test in tinker or unit tests
php artisan tinker

$user = User::find(1);
$business = Business::find(1);

// Test authorization
$user->can('view', $business);     // true/false
$user->can('update', $business);   // true/false
$user->can('verify', $business);   // true/false
```

This policy system provides fine-grained authorization control while maintaining the flexibility needed for your tire shop directory application.