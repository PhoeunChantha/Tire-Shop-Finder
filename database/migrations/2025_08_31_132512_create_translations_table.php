<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->morphs('translatable'); // Creates translatable_id and translatable_type
            $table->string('field_name'); // The field being translated (name, description, etc.)
            $table->string('locale', 5); // Language code (en, km)
            $table->text('value'); // The translated text
            $table->timestamps();
            
            // Ensure unique combination
            $table->unique(['translatable_id', 'translatable_type', 'field_name', 'locale'], 'translations_unique');
            
            // Index for performance
            $table->index(['translatable_id', 'translatable_type']);
            $table->index('locale');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
