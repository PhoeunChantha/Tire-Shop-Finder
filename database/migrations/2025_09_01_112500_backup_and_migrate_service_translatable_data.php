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
        $services = DB::table('services')->get();
        
        foreach ($services as $service) {
            $updates = [];
            
            // Convert name to JSON format (handle null and empty values)
            if ($service->name !== null && $service->name !== '') {
                $updates['name'] = json_encode(['en' => $service->name]);
            } else {
                $updates['name'] = json_encode(['en' => '']);
            }
            
            // Convert descriptions to JSON format (handle null and empty values)
            if ($service->descriptions !== null && $service->descriptions !== '') {
                $updates['descriptions'] = json_encode(['en' => $service->descriptions]);
            } else {
                $updates['descriptions'] = json_encode(['en' => '']);
            }
            
            // Convert SEO fields to JSON format (handle null and empty values)
            if ($service->seo_title !== null && $service->seo_title !== '') {
                $updates['seo_title'] = json_encode(['en' => $service->seo_title]);
            } else {
                $updates['seo_title'] = json_encode(['en' => '']);
            }
            
            if ($service->seo_description !== null && $service->seo_description !== '') {
                $updates['seo_description'] = json_encode(['en' => $service->seo_description]);
            } else {
                $updates['seo_description'] = json_encode(['en' => '']);
            }
            
            // Update the service with JSON data
            if (!empty($updates)) {
                DB::table('services')
                    ->where('id', $service->id)
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
        $services = DB::table('services')->get();
        
        foreach ($services as $service) {
            $updates = [];
            
            // Convert name from JSON to string
            if ($service->name) {
                $nameData = json_decode($service->name, true);
                $updates['name'] = $nameData['en'] ?? '';
            }
            
            // Convert descriptions from JSON to string
            if ($service->descriptions) {
                $descData = json_decode($service->descriptions, true);
                $updates['descriptions'] = $descData['en'] ?? '';
            }
            
            // Convert SEO fields from JSON to string
            if ($service->seo_title) {
                $seoTitleData = json_decode($service->seo_title, true);
                $updates['seo_title'] = $seoTitleData['en'] ?? '';
            }
            
            if ($service->seo_description) {
                $seoDescData = json_decode($service->seo_description, true);
                $updates['seo_description'] = $seoDescData['en'] ?? '';
            }
            
            // Update the service with string data
            if (!empty($updates)) {
                DB::table('services')
                    ->where('id', $service->id)
                    ->update($updates);
            }
        }
    }
};
