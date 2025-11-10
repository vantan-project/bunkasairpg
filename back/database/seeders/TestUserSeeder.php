<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestUserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $DEFAULT_HIT_POINT = 35;
    $now = now();

    $users = [];
    for ($level = 1; $level <= 100; $level++) {
      $users[] = [
        "id" => $level,
        "name" => "レベル{$level}ユーザー",
        'hit_point' => $DEFAULT_HIT_POINT + ($level - 1) * 8,
        "created_at" => $now,
        "updated_at" => $now,
        "level" => $level,
        "experience_point" => $this->calculateExperience($level),
      ];
    }

    User::insert($users);
  }

  private function calculateExperience(int $level): int
  {
    if ($level <= 1) return 0;

    $BASE_EXP = 19;
    $RATE_OF_INCREASE = 0.067;

    $factor = $BASE_EXP / $RATE_OF_INCREASE;
    $power = pow(1 + $RATE_OF_INCREASE, $level - 1);
    $requiredExperience = $factor * ($power - 1);

    return (int) ceil($requiredExperience);
  }
}
