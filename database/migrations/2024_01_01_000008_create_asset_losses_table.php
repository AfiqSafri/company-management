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
            
            // BR-AMS 009: Laporan Kehilangan Aset
            $table->integer('kuantiti_hilang');
            $table->date('tarikh_hilang');
            $table->date('tarikh_ditemui_hilang');
            $table->string('lokasi_hilang');
            $table->text('keadaan_kehilangan');
            $table->boolean('laporan_polis')->default(false);
            $table->string('no_laporan_polis')->nullable();
            $table->date('tarikh_laporan_polis')->nullable();
            $table->decimal('nilai_kerugian', 15, 2);
            $table->text('tindakan_diambil')->nullable();
            
            // Approval for write-off
            $table->boolean('kelulusan_jawatankuasa')->default(false);
            $table->date('tarikh_kelulusan')->nullable();
            $table->enum('status', ['Dilaporkan', 'Dalam Siasatan', 'Selesai', 'Hapus Kira'])->default('Dilaporkan');
            
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['tarikh_hilang']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_losses');
    }
};
