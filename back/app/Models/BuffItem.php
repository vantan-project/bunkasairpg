<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuffItem extends Model
{
    protected $fillable = [
        'item_id',
        'rate',
        'target',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
