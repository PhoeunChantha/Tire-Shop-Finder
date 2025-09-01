<?php

namespace App\Console\Commands;

use App\Models\Business;
use Illuminate\Console\Command;

class TestTranslations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:translations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test translation functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Translation System...');
        
        // Create a test business
        $business = Business::create([
            'name' => 'Test Tire Shop',
            'descriptions' => 'Test Description',
            'created_by' => 1,
            'status' => true,
            'is_vierify' => false,
        ]);
        
        $this->info("Created business with ID: {$business->id}");
        
        // Add translations
        $business->setTranslation('name', 'en', 'Phnom Penh Tire Center');
        $business->setTranslation('name', 'km', 'ហាងកង់ភ្នំពេញ');
        $business->setTranslation('descriptions', 'en', 'Professional tire services in Phnom Penh');
        $business->setTranslation('descriptions', 'km', 'សេវាកម្មកង់វិជ្ជាជីវៈនៅភ្នំពេញ');
        
        $this->info('Added translations...');
        
        // Test retrieval
        $nameEn = $business->getTranslation('name', 'en');
        $nameKm = $business->getTranslation('name', 'km');
        $descEn = $business->getTranslation('descriptions', 'en');
        $descKm = $business->getTranslation('descriptions', 'km');
        
        $this->info("English Name: {$nameEn}");
        $this->info("Khmer Name: {$nameKm}");
        $this->info("English Description: {$descEn}");
        $this->info("Khmer Description: {$descKm}");
        
        // Test magic getters
        $this->info("Magic getter EN: {$business->name_en}");
        $this->info("Magic getter KM: {$business->name_km}");
        
        // Test current locale translation
        app()->setLocale('km');
        $currentName = $business->translate('name');
        $this->info("Current locale (km) name: {$currentName}");
        
        app()->setLocale('en');
        $currentName = $business->translate('name');
        $this->info("Current locale (en) name: {$currentName}");
        
        // Clean up
        $business->translations()->delete();
        $business->delete();
        $this->info('Test completed and cleaned up!');
        
        return 0;
    }
}
