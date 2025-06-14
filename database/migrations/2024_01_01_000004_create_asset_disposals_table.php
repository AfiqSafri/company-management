<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_disposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->integer('quantity_disposed');
            $table->enum('disposal_reason', [
                'obsolete_technology',
                'beyond_repair',
                'no_longer_needed',
                'high_maintenance_cost',
                'safety_hazard',
                'space_constraint',
                'upgrade_replacement',
                'end_of_life',
                'policy_change',
                'other'
            ]);
            $table->enum('disposal_method', ['sale', 'donation', 'destruction', 'trade_in', 'return_to_supplier']);
            $table->text('justification');
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->date('disposal_date')->nullable();
            $table->string('recipient')->nullable();
            $table->decimal('disposal_cost', 10, 2)->default(0);
            $table->decimal('proceeds', 10, 2)->default(0);
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->foreignId('requested_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approval_date')->nullable();
            $table->text('approval_notes')->nullable();
            $table->string('disposal_certificate', 500)->nullable();
            $table->timestamps();

            $table->index(['status', 'disposal_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_disposals');
    }
};
