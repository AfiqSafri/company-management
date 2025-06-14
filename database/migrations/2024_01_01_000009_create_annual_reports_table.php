<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annual_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mosque_id')->constrained()->onDelete('cascade');
            
            // BR-AMS 010: Laporan Tahunan Pengurusan Aset
            $table->year('tahun_laporan');
            
            // Harta Modal (≥RM2000)
            $table->integer('jumlah_harta_modal_kuantiti')->default(0);
            $table->decimal('jumlah_harta_modal_nilai', 20, 2)->default(0);
            
            // Inventori (RM100-RM1999)
            $table->integer('jumlah_inventori_kuantiti')->default(0);
            $table->decimal('jumlah_inventori_nilai', 20, 2)->default(0);
            
            // Pelupusan
            $table->integer('jumlah_pelupusan_kuantiti')->default(0);
            $table->decimal('jumlah_pelupusan_nilai', 20, 2)->default(0);
            
            // Hapus Kira
            $table->integer('jumlah_hapus_kira_kuantiti')->default(0);
            $table->decimal('jumlah_hapus_kira_nilai', 20, 2)->default(0);
            
            // Calculated totals: JUMLAH ASET = (Harta Modal + Inventori) - Pelupusan - Hapus Kira
            $table->integer('jumlah_keseluruhan_kuantiti')->default(0);
            $table->decimal('jumlah_keseluruhan_nilai', 20, 2)->default(0);
            
            $table->date('tarikh_laporan');
            $table->foreignId('disediakan_oleh')->constrained('users'); // Pegawai Aset
            $table->foreignId('disemak_oleh')->nullable()->constrained('users'); // Pengerusi Jawatankuasa
            $table->enum('status', ['Draf', 'Hantar', 'Diluluskan'])->default('Draf');
            
            $table->timestamps();
            
            $table->unique(['mosque_id', 'tahun_laporan']);
            $table->index(['tahun_laporan', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annual_reports');
    }
};
