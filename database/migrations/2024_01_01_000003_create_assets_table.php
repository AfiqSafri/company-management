<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            
            // BR-AMS 001 & 002 fields
            $table->string('nombor_siri_pendaftaran', 50)->unique(); // Format: KODMASJID/HM|I/YY/XX
            $table->text('keterangan_aset'); // Description with brand/model
            $table->enum('cara_aset_diperoleh', ['Pembelian', 'Sumbangan', 'Wakaf', 'Hibah']);
            $table->date('tarikh_pembelian');
            $table->decimal('harga_pembelian', 15, 2); // Full price without discount
            $table->string('penempatan'); // Physical location
            $table->enum('status_aset', ['Aktif', 'Pelupusan', 'Hapus Kira'])->default('Aktif');
            
            // BR-AMS 003 fields
            $table->enum('jenis_aset', ['HM', 'I']); // HM = Harta Modal (≥RM2000), I = Inventori (RM100-RM1999)
            $table->year('tahun_pembelian');
            $table->string('pegawai_penempatan'); // Officer responsible
            
            // Additional details
            $table->string('jenama_model')->nullable(); // Brand/Model
            $table->string('no_siri_pembekal')->nullable(); // Supplier serial number
            $table->string('tempoh_jaminan')->nullable(); // Warranty period
            $table->string('kategori'); // Category (pendingin hawa, kenderaan, etc.)
            $table->string('dokumen_sokongan')->nullable(); // Supporting documents path
            
            // System fields
            $table->foreignId('mosque_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['nombor_siri_pendaftaran']);
            $table->index(['mosque_id', 'jenis_aset']);
            $table->index(['status_aset']);
            $table->index(['tahun_pembelian']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
