<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, backup existing data and create JSON structure
        $businesses = DB::table('businesses')->get();
        
        foreach ($businesses as $business) {
            $updates = [];
            
            // Convert name to JSON format (handle null and empty values)
            if ($business->name !== null && $business->name !== '') {
                $updates['name'] = json_encode(['en' => $business->name]);
            } else {
                $updates['name'] = json_encode(['en' => '']);
            }
            
            // Convert descriptions to JSON format (handle null and empty values)
            if ($business->descriptions !== null && $business->descriptions !== '') {
                $updates['descriptions'] = json_encode(['en' => $business->descriptions]);
            } else {
                $updates['descriptions'] = json_encode(['en' => '']);
            }
            
            // Convert SEO fields to JSON format (handle null and empty values)
            if ($business->seo_title !== null && $business->seo_title !== '') {
                $updates['seo_title'] = json_encode(['en' => $business->seo_title]);
            } else {
                $updates['seo_title'] = json_encode(['en' => '']);
            }
            
            if ($business->seo_description !== null && $business->seo_description !== '') {
                $updates['seo_description'] = json_encode(['en' => $business->seo_description]);
            } else {
                $updates['seo_description'] = json_encode(['en' => '']);
            }
            
            // Update the business with JSON data
            if (!empty($updates)) {
                DB::table('businesses')
                    ->where('id', $business->id)
                    ->update($updates);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert JSON back to string format
        $businesses = DB::table('businesses')->get();
        
        foreach ($businesses as $business) {
            $updates = [];
            
            // Convert name from JSON to string
            if ($business->name) {
                $nameData = json_decode($business->name, true);
                $updates['name'] = $nameData['en'] ?? '';
            }
            
            // Convert descriptions from JSON to string
            if ($business->descriptions) {
                $descData = json_decode($business->descriptions, true);
                $updates['descriptions'] = $descData['en'] ?? '';
            }
            
            // Convert SEO fields from JSON to string
            if ($business->seo_title) {
                $seoTitleData = json_decode($business->seo_title, true);
                $updates['seo_title'] = $seoTitleData['en'] ?? '';
            }
            
            if ($business->seo_description) {
                $seoDescData = json_decode($business->seo_description, true);
                $updates['seo_description'] = $seoDescData['en'] ?? '';
            }
            
            // Update the business with string data
            if (!empty($updates)) {
                DB::table('businesses')
                    ->where('id', $business->id)
                    ->update($updates);
            }
        }
    }
};
