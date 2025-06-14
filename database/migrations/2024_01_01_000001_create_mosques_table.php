<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mosques', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['mosque', 'surau']);
            $table->text('address');
            $table->string('postcode', 10)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 50)->default('Selangor');
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('registration_number', 50)->nullable();
            $table->string('waqf_registration', 50)->nullable();
            $table->string('committee_chairman')->nullable();
            $table->string('controlling_officer')->nullable();
            $table->string('asset_officer')->nullable();
            $table->string('assistant_asset_officer')->nullable();
            $table->date('established_date')->nullable();
            $table->decimal('land_area', 10, 2)->nullable();
            $table->decimal('building_area', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mosques');
    }
};
