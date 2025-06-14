<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            
            // BR-AMS 006: Rekod Penyelenggaraan
            $table->date('tarikh');
            $table->text('butiran_kerja');
            $table->enum('jenis_penyelenggaraan', ['Pencegahan', 'Pembaikan', 'Kecemasan']);
            $table->decimal('kos', 10, 2)->default(0);
            $table->string('syarikat_vendor')->nullable();
            $table->string('nama_juruteknik')->nullable();
            $table->text('catatan')->nullable();
            $table->date('tarikh_seterusnya')->nullable();
            
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['asset_id', 'tarikh']);
            $table->index(['jenis_penyelenggaraan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_records');
    }
};
