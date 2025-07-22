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
        Schema::create('user_weapons', function (Blueprint $table) {
            $table->unsignedBigInteger('weapon_id');

            $table->foreignUuid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('weapon_id')->references('id')->on('weapons')->onDelete('cascade');

            $table->primary(['user_id', 'weapon_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_weapons');
    }
};
