<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            
            // BR-AMS 004: Borang Pinjaman/Pergerakan Aset
            $table->string('nama_pemohon');
            $table->string('jawatan');
            $table->text('tujuan');
            $table->date('tarikh_pinjam');
            $table->date('tarikh_pulang')->nullable();
            $table->string('lokasi_asal');
            $table->string('lokasi_tujuan');
            $table->string('tandatangan_peminjam')->nullable(); // File path or signature data
            $table->string('tandatangan_penyerah')->nullable(); // File path or signature data
            $table->text('catatan')->nullable();
            $table->enum('status', ['dipinjam', 'dipulang', 'lewat'])->default('dipinjam');
            
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['asset_id', 'tarikh_pinjam']);
            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_movements');
    }
};
