<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_losses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->integer('quantity_lost');
            $table->enum('loss_type', ['theft', 'damage', 'natural_disaster', 'accident', 'missing', 'other']);
            $table->date('loss_date');
            $table->date('discovered_date');
            $table->string('location_of_loss');
            $table->text('circumstances');
            $table->string('police_report_number', 100)->nullable();
            $table->date('police_report_date')->nullable();
            $table->decimal('estimated_loss_value', 15, 2);
            $table->string('insurance_claim_number', 100)->nullable();
            $table->decimal('insurance_payout', 15, 2)->default(0);
            $table->enum('status', ['reported', 'investigating', 'resolved', 'written_off'])->default('reported');
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('investigated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('investigation_notes')->nullable();
            $table->timestamps();

            $table->index(['loss_date']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_losses');
    }
};
