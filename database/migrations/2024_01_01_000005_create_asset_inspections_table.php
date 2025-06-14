<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_inspections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            
            // BR-AMS 005: Borang Pemeriksaan Aset (Annual audit by Bendahari)
            $table->date('tarikh_pemeriksaan');
            $table->string('lokasi_mengikut_rekod');
            $table->string('lokasi_semasa_pemeriksaan');
            $table->enum('status_fizikal', ['A', 'B', 'C', 'D', 'E']); // A=Baik, E=Hilang
            $table->text('catatan_keadaan')->nullable();
            $table->text('tindakan_diperlukan')->nullable();
            $table->string('pemeriksa'); // Bendahari name
            $table->string('tandatangan_pemeriksa')->nullable();
            
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['asset_id', 'tarikh_pemeriksaan']);
            $table->index(['status_fizikal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_inspections');
    }
};
