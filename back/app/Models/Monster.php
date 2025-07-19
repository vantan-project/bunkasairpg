<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Monster extends Model
{
    protected $fillable = [
        'weapon_id',
        'item_id',
        'name',
        'image_url',
        'attack',
        'hit_point',
        'experience_point',
        'slash',
        'blow',
        'shoot',
        'neutral',
        'flame',
        'water',
        'ice',
        'thunder',
    ];
}
