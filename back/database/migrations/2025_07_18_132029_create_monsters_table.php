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
        Schema::create('monsters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('weapon_id');
            $table->unsignedBigInteger('item_id');
            $table->string('name');
            $table->text('image_url');
            $table->unsignedInteger('attack');
            $table->unsignedInteger('hit_point');
            $table->unsignedInteger('experience_point')->default(0);
            $table->decimal('rate', 2, 1);
            $table->decimal('blow', 2, 1);
            $table->decimal('shoot', 2, 1);
            $table->decimal('neutral', 2, 1);
            $table->decimal('flame', 2, 1);
            $table->decimal('water', 2, 1);
            $table->decimal('ice', 2, 1);
            $table->decimal('thunder', 2, 1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monsters');
    }
};
