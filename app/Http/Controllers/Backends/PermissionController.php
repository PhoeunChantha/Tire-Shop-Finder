<?php

namespace App\Http\Controllers\Backends;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Traits\HasDataTableFilters;
use App\Http\Requests\PermissionStoreRequest;
use App\Http\Requests\PermissionUpdateRequest;
use Spatie\Permission\Models\Permission;
class PermissionController extends Controller
{
    use HasDataTableFilters;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterConfig = [
            'search' => [
                'type' => 'search',
                'fields' => ['name']
            ],
        ];

        // Get paginated permissions with filters
        $permissions = $this->getPaginatedWithFilters(
            Permission::query(),
            $request,
            $filterConfig,
            10 // default per page
        );
        $filters = $request->only([
            'search',
            'per_page',
            'page'
        ]);
        return Inertia::render('admin/permission/index', [
            'permissions' => $permissions,
            'filters' => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/permission/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|array|min:1',
            'name.*' => 'required|string|max:255|unique:permissions,name'
        ]);
        try {
            foreach ($request->name as $index => $name) {
                Permission::create(['name' => $name]);
            }
            return to_route('permissions.index')
                ->with('success', 'Permission created successfully.');
        } catch (\Exception $e) {
            return to_route('permissions.index')
                ->with('error', 'Failed to create permission.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $permission = Permission::findOrFail($id);

        return Inertia::render('admin/permission/show', [
            'permission' => $permission
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $permission = Permission::findOrFail($id);

        return Inertia::render('admin/permission/edit', [
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id
        ]);

        try {
            $permission = Permission::findOrFail($id);
            $permission->update(['name' => $request->name]);

            return to_route('permissions.index')
                ->with('success', 'Permission updated successfully.');
        } catch (\Exception $e) {
            return to_route('permissions.index')
                ->with('error', 'Failed to update permission.');
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $permission = Permission::findOrFail($id);

            // Prevent deletion of critical permissions
            if ($permission->name === 'super-admin') {
                return to_route('permissions.index')
                    ->with('error', 'Cannot delete the super-admin permission.');
            }

            $permission->delete();

            return to_route('permissions.index')
                ->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {
            return to_route('permissions.index')
                ->with('error', 'Failed to delete permission.');
        }
    }
}
