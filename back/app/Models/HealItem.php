<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealItem extends Model
{
    protected $fillable = [
        'item_id',
        'amount',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
