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
        Schema::table('services', function (Blueprint $table) {
            // Convert existing string fields to JSON for translations
            $table->json('name')->nullable()->change();
            $table->json('descriptions')->nullable()->change();
            $table->json('seo_title')->nullable()->change();  
            $table->json('seo_description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Revert to string columns
            $table->string('name')->change();
            $table->text('descriptions')->nullable()->change();
            $table->string('seo_title')->nullable()->change();
            $table->text('seo_description')->nullable()->change();
        });
    }
};
