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
        // At this point, data should already be in JSON format from previous migration
        // Now we need to actually change the column types to JSON
        Schema::table('businesses', function (Blueprint $table) {
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
        Schema::table('businesses', function (Blueprint $table) {
            // Revert to string columns
            $table->string('name')->change();
            $table->text('descriptions')->nullable()->change();
            $table->string('seo_title')->nullable()->change();
            $table->text('seo_description')->nullable()->change();
        });
    }
};
