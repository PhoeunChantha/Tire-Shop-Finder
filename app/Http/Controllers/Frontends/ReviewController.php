<?php

namespace App\Http\Controllers\Frontends;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'comment' => 'nullable|string|max:1000',
            'rate' => 'required|string|in:1,2,3,4,5',
            'business_id' => 'required|integer|exists:businesses,id',
            'device_id' => 'nullable|string|max:255',
            'user_id' => 'nullable|string|max:255',
        ]);

        // Set user_id from authenticated user if available
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        }

        // Prevent duplicate reviews from the same device for the same business
        $existingReview = DB::table('reviews')
            ->where('business_id', $validated['business_id'])
            ->where(function ($query) use ($validated) {
                if (!empty($validated['user_id'])) {
                    $query->where('user_id', $validated['user_id']);
                } else {
                    $query->where('device_id', $validated['device_id']);
                }
            })
            ->exists();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this business.');
        }

        // Store the review
        DB::table('reviews')->insert([
            'comment' => $validated['comment'],
            'rate' => $validated['rate'],
            'business_id' => $validated['business_id'],
            'device_id' => $validated['device_id'],
            'user_id' => $validated['user_id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Review submitted successfully! Thank you for your feedback.');
    }

    /**
     * Get reviews for a specific business
     */
    public function getBusinessReviews(Request $request, $businessId)
    {
        $reviews = DB::table('reviews')
            ->where('business_id', $businessId)
            ->leftJoin('users', 'reviews.user_id', '=', 'users.id')
            ->select([
                'reviews.id',
                'reviews.comment',
                'reviews.rate',
                'reviews.created_at',
                'users.name as user_name'
            ])
            ->orderBy('reviews.created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Get review statistics for a business
     */
    public function getBusinessReviewStats($businessId)
    {
        $stats = DB::table('reviews')
            ->where('business_id', $businessId)
            ->select([
                DB::raw('COUNT(*) as total_reviews'),
                DB::raw('AVG(CAST(rate as DECIMAL(3,2))) as average_rating'),
                DB::raw('SUM(CASE WHEN rate = "5" THEN 1 ELSE 0 END) as five_star'),
                DB::raw('SUM(CASE WHEN rate = "4" THEN 1 ELSE 0 END) as four_star'),
                DB::raw('SUM(CASE WHEN rate = "3" THEN 1 ELSE 0 END) as three_star'),
                DB::raw('SUM(CASE WHEN rate = "2" THEN 1 ELSE 0 END) as two_star'),
                DB::raw('SUM(CASE WHEN rate = "1" THEN 1 ELSE 0 END) as one_star'),
            ])
            ->first();

        return response()->json($stats);
    }
}