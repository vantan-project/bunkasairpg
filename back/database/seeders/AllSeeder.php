<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1Id = (string) Str::uuid();
        $user2Id = (string) Str::uuid();
        $user3Id = (string) Str::uuid();

        DB::table('users')->insert([
            [
                'id' => $user1Id,
                'name' => '勇者くん',
                'level' => 3,
                'max_hit_point' => 100,
                'hit_point' => 85,
                'experience_point' => 200,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => $$user2Id,
                'weapon_id' => 1,
                'name' => 'テストくん',
                'max_hit_point' => 35,
                'hit_point' => 35,
                'experience_point' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => $user3Id,
                'name' => 'ふくしなさん',
                'level' => 10,
                'max_hit_point' => 20,
                'hit_point' => 150,
                'experience_point' => 900,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        DB::table('weapons')->insert([
            [
                'name' => '炎の剣',
                'image_url' => 'https://example.com/images/flame_sword.png',
                'physics_attack' => 50,
                'element_attack' => 20,
                'physics_type' => 'slash',
                'element_type' => 'flame',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '氷の弓',
                'image_url' => 'https://example.com/images/ice_bow.png',
                'physics_attack' => 35,
                'element_attack' => 30,
                'physics_type' => 'shoot',
                'element_type' => 'water',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '木のハンマー',
                'image_url' => 'https://example.com/images/wood_hammer.png',
                'physics_attack' => 60,
                'physics_type' => 'blow',
                'element_type' => 'wood',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('user_weapon')->insert([
            ['user_id' => $user2Id, 'weapon_id' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('items')->insert([
            [
                'name' => '回復ポーション',
                'image_url' => 'https://example.com/images/heal_potion.png',
                'effect_type' => 'heal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '力の薬',
                'image_url' => 'https://example.com/images/power_buff.png',
                'effect_type' => 'buff',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '毒矢',
                'image_url' => 'https://example.com/images/poison_arrow.png',
                'effect_type' => 'debuff',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('user_items')->insert([
            ['user_id' => $user2Id, 'item_id' => 1, 'count' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $user3Id, 'item_id' => 2, 'count' => 1, 'created_at' => now(), 'updated_at' => now()]
        ]);

        DB::table('monsters')->insert([
            [
                'id' => Str::uuid(),
                'weapon_id' => 1,
                'item_id' => 1,
                'name' => 'スライム',
                'image_url' => 'https://example.com/images/slime.png',
                'attack' => 10,
                'hit_point' => 30,
                'experience_point' => 5,
                'slash' => 1.0,
                'blow' => 0.5,
                'shoot' => 0.8,
                'neutral' => 1.0,
                'flame' => 0.0,
                'water' => 0.5,
                'wood' => 0.2,
                'shine' => 0.0,
                'dark' => 0.0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'weapon_id' => 2,
                'name' => 'ゴブリン',
                'image_url' => 'https://example.com/images/goblin.png',
                'attack' => 25,
                'hit_point' => 50,
                'experience_point' => 15,
                'slash' => 1.2,
                'blow' => 0.8,
                'shoot' => 1.0,
                'neutral' => 1.0,
                'flame' => 0.5,
                'water' => 0.2,
                'wood' => 0.3,
                'shine' => 0.0,
                'dark' => 0.1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'name' => 'ドラゴン',
                'image_url' => 'https://example.com/images/dragon.png',
                'attack' => 100,
                'hit_point' => 300,
                'experience_point' => 200,
                'slash' => 1.5,
                'blow' => 1.0,
                'shoot' => 1.2,
                'neutral' => 1.0,
                'flame' => 2.0,
                'water' => 0.5,
                'wood' => 0.5,
                'shine' => 0.8,
                'dark' => 1.0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('heal_items')->insert([
            [
                'item_id' => 1,
                'amount' => 50,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        DB::table('buff_items')->insert([
            [
                'item_id' => 2,
                'rate' => 1.5,
                'target' => 'slash',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        DB::table('debuff_items')->insert([
            [
                'item_id' => 3,
                'rate' => 1.5,
                'target' => 'shoot',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
