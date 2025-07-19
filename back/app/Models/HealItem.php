<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealItem extends Model
{
    protected $fillable = [
        'item_id',
        'amount',
    ];
}
