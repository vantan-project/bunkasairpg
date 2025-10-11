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
    Schema::create('weapons', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('image_url');
      $table->string('index_number')->unique();
      $table->unsignedInteger('physics_attack');
      $table->unsignedInteger('element_attack')->nullable();
      $table->enum('physics_type', ['slash', 'blow', 'shoot']);
      $table->enum('element_type', ['neutral', 'flame', 'water', 'wood', 'shine', 'dark']);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('weapons');
  }
};
