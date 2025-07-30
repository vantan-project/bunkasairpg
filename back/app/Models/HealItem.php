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

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
