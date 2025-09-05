<?php

namespace App\Http\Controllers\Backends;

use App\Helpers\ImageManager;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Traits\HasDataTableFilters;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    use HasDataTableFilters;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Banner::class);
        
        $query = Banner::with(['creator'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('descriptions', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $banners = $query->paginate($request->get('per_page', 10));
        $filters = $this->getFilters($request);

        return Inertia::render('admin/banner/index', [
            'banners' => $banners,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {   
        $this->authorize('create', Banner::class);
        
        return Inertia::render('admin/banner/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Banner::class);

        $validated = $request->validate([
            'title_translations.en' => 'required|string|max:255',
            'title_translations.km' => 'nullable|string|max:255',
            'descriptions_translations.en' => 'nullable|string',
            'descriptions_translations.km' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'url' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = ImageManager::uploadImage($request->file('image'), 'banners');
        }

        // Prepare translations data
        $titleTranslations = [
            'en' => $validated['title_translations']['en'],
            'km' => $validated['title_translations']['km'] ?? '',
        ];

        $descriptionsTranslations = [
            'en' => $validated['descriptions_translations']['en'] ?? '',
            'km' => $validated['descriptions_translations']['km'] ?? '',
        ];

        Banner::create([
            'title' => json_encode($titleTranslations),
            'descriptions' => json_encode($descriptionsTranslations),
            'image' => $imagePath,
            'url' => $validated['url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
            'created_by' => auth()->id(),
        ]);

        return to_route('banners.index')
            ->with('success', 'Banner created successfully!');
    }

    public function show(Banner $banner): Response
    {
        $this->authorize('view', $banner);
        
        $banner->load(['creator']);
        
        return Inertia::render('admin/banner/show', [
            'banner' => $banner
        ]);
    }

    public function edit(Banner $banner): Response
    {
        $this->authorize('update', $banner);

        $banner->load(['creator']);
        
        // Get raw banner data and add translation arrays for form editing
        $bannerData = $banner->toArray();
        $translations = $banner->getTranslationsForForm();
        
        return Inertia::render('admin/banner/edit', [
            'banner' => array_merge($bannerData, $translations),
        ]);
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $this->authorize('update', $banner);

        $validated = $request->validate([
            'title_translations.en' => 'required|string|max:255',
            'title_translations.km' => 'nullable|string|max:255',
            'descriptions_translations.en' => 'nullable|string',
            'descriptions_translations.km' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'url' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Handle image upload
        $imagePath = $banner->image;
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($banner->image) {
                ImageManager::deleteImage($banner->image);
            }
            $imagePath = ImageManager::uploadImage($request->file('image'), 'banners');
        }

        // Prepare translations data
        $titleTranslations = [
            'en' => $validated['title_translations']['en'],
            'km' => $validated['title_translations']['km'] ?? '',
        ];

        $descriptionsTranslations = [
            'en' => $validated['descriptions_translations']['en'] ?? '',
            'km' => $validated['descriptions_translations']['km'] ?? '',
        ];

        $banner->update([
            'title' => json_encode($titleTranslations),
            'descriptions' => json_encode($descriptionsTranslations),
            'image' => $imagePath,
            'url' => $validated['url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return to_route('banners.index')
            ->with('success', 'Banner updated successfully!');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        $this->authorize('delete', $banner);

        // Delete image if exists
        if ($banner->image) {
            ImageManager::deleteImage($banner->image);
        }

        $banner->delete();
        
        return to_route('banners.index')
            ->with('success', 'Banner deleted successfully!');
    }

    public function toggleStatus(Banner $banner): RedirectResponse
    {
        $this->authorize('manageStatus', $banner);
        
        $banner->update([
            'is_active' => !$banner->is_active
        ]);

        $status = $banner->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Banner {$status} successfully!");
    }

    private function getFilters(Request $request): array
    {
        return [
            'search' => $request->get('search'),
            'status' => $request->get('status'),
            'per_page' => $request->get('per_page', 10),
            'page' => $request->get('page', 1),
        ];
    }
}