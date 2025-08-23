<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function create(Business $business): Response
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('service/create', [
            'business' => $business
        ]);
    }

    public function store(Request $request, Business $business): RedirectResponse
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Debug: Log the incoming request data
        \Log::info('Service creation request data:', $request->all());

        $validated = $request->validate([
            'services' => 'required|array|min:1',
            'services.*.name' => 'required|string|max:255',
            'services.*.price' => 'required|numeric|min:0',
            'services.*.descriptions' => 'nullable|string',
            'services.*.status' => 'boolean'
        ]);

        foreach ($validated['services'] as $serviceData) {
            Service::create([
                'name' => $serviceData['name'],
                'price' => $serviceData['price'],
                'descriptions' => $serviceData['descriptions'] ?? null,
                'status' => $serviceData['status'] ?? true,
                'bussiness_id' => $business->id
            ]);
        }

        return redirect()->route('user.dashboard')
            ->with('success', 'Services created successfully!');
    }

    public function edit(Business $business, Service $service): Response
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id() || $service->bussiness_id !== $business->id) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('service/edit', [
            'business' => $business,
            'service' => $service
        ]);
    }

    public function update(Request $request, Business $business, Service $service): RedirectResponse
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id() || $service->bussiness_id !== $business->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'descriptions' => 'nullable|string',
            'status' => 'boolean'
        ]);

        $service->update($validated);

        return redirect()->route('user.dashboard')
            ->with('success', 'Service updated successfully!');
    }

    public function destroy(Business $business, Service $service): RedirectResponse
    {
        // Ensure the business belongs to the authenticated user
        if ($business->created_by !== Auth::id() || $service->bussiness_id !== $business->id) {
            abort(403, 'Unauthorized');
        }

        $service->delete();

        return back()->with('success', 'Service deleted successfully!');
    }
}