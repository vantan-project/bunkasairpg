<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuffItem extends Model
{
    protected $fillable = [
        'item_id',
        'rate',
        'target',
    ];
}
