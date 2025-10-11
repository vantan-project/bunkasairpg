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
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('weapon_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->string('index_number');
            $table->string('name');
            $table->text('image_url');
            $table->unsignedInteger('attack');
            $table->unsignedInteger('hit_point');
            $table->unsignedInteger('experience_point');
            $table->decimal('slash', 2, 1);
            $table->decimal('blow', 2, 1);
            $table->decimal('shoot', 2, 1);
            $table->decimal('neutral', 2, 1);
            $table->decimal('flame', 2, 1);
            $table->decimal('water', 2, 1);
            $table->decimal('wood', 2, 1);
            $table->decimal('shine', 2, 1);
            $table->decimal('dark', 2, 1);
            $table->timestamps();

            $table->foreign('weapon_id')->references('id')->on('weapons')->onDelete('set null');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('set null');
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
