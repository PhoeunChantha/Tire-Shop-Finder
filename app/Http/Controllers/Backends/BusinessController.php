<?php

namespace App\Http\Controllers\Backends;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Province;
use App\Models\District;
use App\Models\Commune;
use App\Models\Village;
use App\Models\User;
use App\Services\BusinessService;
use App\Http\Requests\BusinessStoreRequest;
use App\Http\Requests\BusinessUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Traits\HasDataTableFilters;
use Illuminate\Support\Facades\Bus;

class BusinessController extends Controller
{
    use HasDataTableFilters;

    public function __construct(
        private BusinessService $businessService
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Business::class);
        $query = Business::with(['owner', 'province', 'district', 'commune', 'village'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('descriptions', 'like', "%{$search}%")
                    ->orWhereHas('owner', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'verified') {
                $query->where('is_vierify', true);
            } elseif ($status === 'pending') {
                $query->where('is_vierify', false);
            }
        }

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->get('province_id'));
        }

        $businesses = $query->paginate($request->get('per_page', 10));
        $filters = $this->getFilters($request);

        return Inertia::render('admin/business/index', [
            'businesses' => $businesses,
            'filters' => $filters,
            'provinces' => Province::all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Business::class);
        return Inertia::render('admin/business/create', [
            'provinces' => Province::all(),
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function store(BusinessStoreRequest $request): RedirectResponse
    {

        $this->authorize('create', Business::class);

        $validated = $request->validated();

        $business = $this->businessService->createBusiness($validated);

        return to_route('admin.services.create', $business->id)
            ->with('success', 'Business created successfully! Now add services for this business.');
    }

    // API endpoints for location dropdowns
    public function getDistricts(Province $province)
    {
        return response()->json($province->districts);
    }

    public function getCommunes(District $district)
    {
        return response()->json($district->communes);
    }

    public function getVillages(Commune $commune)
    {
        return response()->json($commune->villages);
    }

    public function show(Business $business): Response
    {
        $business->load(['owner', 'province', 'district', 'commune', 'village', 'services']);

        return Inertia::render('admin/business/show', [
            'business' => $business
        ]);
    }

    public function edit(Business $business): Response
    {
        $this->authorize('update', $business);

        $business->load(['owner', 'province', 'district', 'commune', 'village', 'services']);

        // Get raw business data and add translation arrays for form editing
        $businessData = $business->toArray();
        $translations = $business->getTranslationsForForm();

        return Inertia::render('admin/business/edit', [
            'business' => array_merge($businessData, $translations),
            'provinces' => Province::all(),
        ]);
    }

    public function update(BusinessUpdateRequest $request, Business $business): RedirectResponse
    {
        try {
            $this->authorize('update', $business);

            $validated = $request->validated();

            $this->businessService->updateBusiness($business, $validated);

            return to_route('businesses.index')
                ->with('success', 'Business updated successfully!');
        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to update business. Please try again.')
                ->withInput();
        }
    }

    public function destroy(Business $business): RedirectResponse
    {
        $this->authorize('delete', $business);

        $business->delete();

        return to_route('businesses.index')
            ->with('success', 'Business deleted successfully!');
    }

    public function verify(Business $business): RedirectResponse
    {
        $this->authorize('verify', $business);
        $this->businessService->verifyBusiness($business);

        return back()->with('success', 'Business verified successfully!');
    }

    public function reject(Business $business): RedirectResponse
    {
        $this->authorize('reject', $business);
        $this->businessService->rejectBusiness($business);

        return back()->with('success', 'Business rejected successfully!');
    }

    private function getFilters(Request $request): array
    {
        return [
            'search' => $request->get('search'),
            'status' => $request->get('status'),
            'province_id' => $request->get('province_id'),
            'per_page' => $request->get('per_page', 10),
            'page' => $request->get('page', 1),
        ];
    }
}
