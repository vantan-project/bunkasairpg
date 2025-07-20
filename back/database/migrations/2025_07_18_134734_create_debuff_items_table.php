<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('debuff_items', function (Blueprint $table) {
            $table->unsignedBigInteger('item_id');
            $table->decimal('rate', 2, 1);
            $table->enum('target', ["slash", "blow", "shoot",  "neutral", "flame", "water", "wood", "shine", 'dark']);
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debuff_items');
    }
};
