<?php

namespace App\Http\Controllers\Backends;

use App\Helpers\ImageManager;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UserStoreRequest;
use App\Http\Traits\HasDataTableFilters;
use App\Http\Requests\UserUpdateRequest;
class UserController extends Controller
{
    use HasDataTableFilters;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);
        $filterConfig = [
            'search' => [
                'type' => 'search',
                'fields' => ['name', 'email']
            ],
            'email_verified' => [
                'type' => 'boolean',
                'field' => 'email_verified_at'
            ],
            'created_date' => [
                'type' => 'date_range',
                'field' => 'created_at',
                'key' => 'created_date'
            ],
            '_default_sort' => [
                'field' => 'created_at',
                'direction' => 'desc'
            ]
        ];

        // Get paginated users with filters
        $users = $this->getPaginatedWithFilters(
            User::query()->with(['roles']),
            $request,
            $filterConfig,
            10 // default per page
        );

        // Extract current filter values
        $filters = $request->only([
            'search', 'email_verified', 'created_date_start', 'created_date_end', 'per_page'
        ]);

        return Inertia::render('admin/user/index', [
            'users' => $users,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        return Inertia::render('admin/user/create', [
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $this->authorize('create', User::class);
        $validated = $request->validated();
        
        try {
            $profilePath = null;
            if ($request->hasFile('profile')) {
                $profilePath = ImageManager::uploadImage($request->file('profile'),'users');
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'dob' => $validated['dob'] ?? null,
                'address' => $validated['address'] ?? null,
                'profile' => $profilePath,
                'status' => $validated['status'] ?? false,
            ]);

            if ($request->has('role')) {
                $user->assignRole($request->role);
            }

            return redirect()->route('users.index')
                ->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->authorize('update', User::class);
        $user = User::with(['roles'])->findOrFail($id);
        
        return Inertia::render('admin/user/edit', [
            'user'  => $user,
            'roles' => Role::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, $id)
    {
        $this->authorize('update', User::class);
        $validated = $request->validated();

        try {
            $user = User::findOrFail($id);
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'dob' => $validated['dob'] ?? null,
                'address' => $validated['address'] ?? null,
                'status' => $validated['status'] ?? false,
            ];
            if ($request->hasFile('profile')) {
                $profilePath = ImageManager::updateImage($request->file('profile'), $user->profile,'users');
                $updateData['profile'] = $profilePath;
            }

            $user->update($updateData);

            // Update role if provided
            if ($request->has('role')) {
                $user->syncRoles([$request->role]);
            }

            cache()->forget('users');

            return redirect()->route('users.index')
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('users.index')
                ->with('error', 'Failed to update user.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->authorize('delete', User::class);
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return redirect()->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('users.index')
                ->with('error', 'Failed to delete user.');
        }
    }
}
