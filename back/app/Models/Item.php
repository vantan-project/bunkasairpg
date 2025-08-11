<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Item extends Model
{
    protected $fillable = [
        'name',
        'image_url',
        'effect_type',
    ];

    public function healItem(): HasOne
    {
        return $this->hasOne(HealItem::class);
    }

    public function buffItem(): HasOne
    {
        return $this->hasOne(BuffItem::class);
    }

    public function debuffItem(): HasOne
    {
        return $this->hasOne(DebuffItem::class);
    }
}
