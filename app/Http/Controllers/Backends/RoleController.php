<?php

namespace App\Http\Controllers\Backends;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Traits\HasDataTableFilters;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\RoleStoreRequest;
use App\Http\Requests\RoleUpdateRequest;
use Inertia\Inertia;

class RoleController extends Controller
{
    use HasDataTableFilters;
    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        // Check if user can view roles
        $this->authorize('viewAny', Role::class);
        $filterConfig = [
            'search' => [
                'type' => 'search',
                'fields' => ['name']
            ],
        ];

        // Get paginated permissions with filters
        $roles = $this->getPaginatedWithFilters(
            Role::query()->with(['permissions', 'users']),
            $request,
            $filterConfig,
            10 // default per page
        );
        $filters = $request->only([
            'search','per_page','page'
        ]);
        
        return Inertia::render('admin/role/index', [
            'roles' => $roles,
            'filters' => $filters,
            'permissions' => Permission::all(),
            'can' => [
                'create' => auth()->user()->can('create', Role::class),
                'manage_permissions' => auth()->user()->can('assignPermissions', new Role()),
            ]
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        // Check if user can create roles
        $this->authorize('create', Role::class);
        return Inertia::render('admin/role/create', [
            'permissions' => Permission::all()
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        // Check if user can create roles
        $this->authorize('create', Role::class);
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'permissions' => 'array',
                'permissions.*' => 'exists:permissions,id'
            ]);

            $role = Role::create(['name' => $request->name]);
            
            if ($request->has('permissions')) {
                // Check if user can assign permissions to this role
                $this->authorize('assignPermissions', $role);
                $role->syncPermissions($request->permissions);
            }
            return to_route('roles.index')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            return to_route('roles.index')->with('error', 'Failed to create role.');
        }

    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        // Check if user can view this role
        $this->authorize('view', $role);
        return Inertia::render('admin/role/show', [
            'role' => $role->load('permissions'),
            'can' => [
                'update' => auth()->user()->can('update', $role),
                'delete' => auth()->user()->can('delete', $role),
                'assign_permissions' => auth()->user()->can('assignPermissions', $role),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        // Check if user can update this role
        $this->authorize('update', $role);
        return Inertia::render('admin/role/edit', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::all(),
            'can' => [
                'assign_permissions' => auth()->user()->can('assignPermissions', $role),
            ]
        ]);
    }

    /**
     * Update the specified role.
     */
   public function update(Request $request, Role $role)
    {
        // Check if user can update this role
        $this->authorize('update', $role);
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
                'permissions' => 'array',
                'permissions.*' => 'exists:permissions,id'
            ]);

            $role->update(['name' => $request->name]);

            if ($request->has('permissions')) {
                // Check if user can assign permissions to this role
                $this->authorize('assignPermissions', $role);
                $role->syncPermissions($request->permissions);
            }
            return to_route('roles.index')->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return to_route('roles.index')->with('error', 'Failed to update role.');
        }

    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        // Check if user can delete this role
        $this->authorize('delete', $role);
        try {
            // Prevent deletion of super-admin role
            if ($role->name === 'super-admin') {
                return to_route('roles.index')
                    ->with('error', 'Cannot delete the super-admin role.');
            }

            $role->delete();

            return to_route('roles.index')
                ->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            return to_route('roles.index')
                ->with('error', 'Failed to delete role.');
        }
    }
}
