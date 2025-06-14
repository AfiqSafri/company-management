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
            
            // BR-AMS 007: Permohonan Pelupusan Aset
            $table->enum('justifikasi_pelupusan', [
                'rosak_tidak_boleh_dibaiki',
                'kos_pembaikan_tinggi', 
                'teknologi_lapuk',
                'tidak_diperlukan',
                'keselamatan',
                'lain_lain'
            ]);
            $table->enum('kaedah_pelupusan', ['jual', 'derma', 'musnah', 'tukar_beli']);
            $table->date('tarikh_permohonan');
            
            // BR-AMS 008: Laporan Tindakan Pelupusan
            $table->date('tarikh_pelupusan')->nullable();
            $table->string('nama_syarikat_pelupus')->nullable();
            $table->decimal('harga_jualan', 10, 2)->nullable();
            $table->string('resit_jualan')->nullable(); // File path
            $table->string('gambar_aset')->nullable(); // File path
            
            // Approval process
            $table->boolean('kelulusan_jawatankuasa')->default(false);
            $table->date('tarikh_kelulusan')->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status', ['Permohonan', 'Diluluskan', 'Ditolak', 'Selesai'])->default('Permohonan');
            
            $table->foreignId('requested_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index(['status', 'tarikh_permohonan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_disposals');
    }
};
