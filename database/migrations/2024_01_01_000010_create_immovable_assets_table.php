<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('immovable_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mosque_id')->constrained()->onDelete('cascade');
            
            // BR-AMS 011: Rekod Aset Tak Alih
            $table->string('no_hak_milik'); // Title deed number
            $table->string('jenis_bangunan'); // Building type
            $table->decimal('keluasan_meter_persegi', 10, 2); // Area in square meters
            $table->decimal('keluasan_kaki_persegi', 10, 2); // Area in square feet
            $table->text('alamat_penuh');
            $table->date('tarikh_pemilikan');
            $table->enum('cara_diperoleh', ['Pembelian', 'Wakaf', 'Hibah']);
            $table->decimal('nilai_tanah', 15, 2)->nullable();
            $table->decimal('nilai_bangunan', 15, 2)->nullable();
            $table->string('dokumen_geran')->nullable(); // File path to title deed
            $table->string('lokasi_simpanan_dokumen')->default('Peti besi'); // Storage location
            $table->text('catatan')->nullable();
            
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['no_hak_milik']);
            $table->index(['mosque_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('immovable_assets');
    }
};
