<?php

namespace App\Console\Commands;

use App\Models\Business;
use App\Models\Service;
use App\Models\Translation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateTranslatableData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:translatable-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing translation data to Spatie Laravel Translatable format';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of translatable data...');
        
        DB::beginTransaction();
        
        try {
            // Migrate businesses
            $businesses = Business::all();
            $this->info("Found {$businesses->count()} businesses to migrate");
            
            foreach ($businesses as $business) {
                $this->migrateModelTranslations($business, Business::class);
            }
            
            // Migrate services
            $services = Service::all();
            $this->info("Found {$services->count()} services to migrate");
            
            foreach ($services as $service) {
                $this->migrateModelTranslations($service, Service::class);
            }
            
            DB::commit();
            $this->info('Migration completed successfully!');
            
        } catch (\Exception $e) {
            DB::rollback();
            $this->error("Migration failed: " . $e->getMessage());
            return Command::FAILURE;
        }
        
        return Command::SUCCESS;
    }
    
    private function migrateModelTranslations($model, $modelClass)
    {
        $translatableFields = ['name', 'descriptions', 'seo_title', 'seo_description'];
        $locales = ['en', 'km'];
        
        foreach ($translatableFields as $field) {
            $translations = [];
            
            // Get existing translations from the translations table
            $existingTranslations = Translation::where('translatable_type', $modelClass)
                ->where('translatable_id', $model->id)
                ->where('field_name', $field)
                ->get();
            
            // Add existing translations to the array
            foreach ($existingTranslations as $translation) {
                $translations[$translation->locale] = $translation->value;
            }
            
            // If no translations exist, use the current field value as English
            if (empty($translations) && $model->getAttribute($field)) {
                $translations['en'] = $model->getAttribute($field);
            }
            
            // Update the model with JSON translation data
            if (!empty($translations)) {
                $model->setAttribute($field, $translations);
                $modelName = class_basename($modelClass);
                $this->line("Migrated {$field} for {$modelName} #{$model->id}");
            }
        }
        
        // Save without triggering events to avoid issues
        $model->saveQuietly();
    }
}
