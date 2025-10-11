<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weapon extends Model
{
    protected $fillable = [
        'name',
        'image_url',
        'index_number',
        'physics_attack',
        'element_attack',
        'physics_type',
        'element_type',
    ];
}
