<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'image_url',
        'effect_type',
    ];

    public function healItem()
    {
        return $this->hasOne(HealItem::class, 'item_id');
    }

    public function buffItem()
    {
        return $this->hasOne(BuffItem::class, 'item_id');
    }

    public function debuffItem()
    {
        return $this->hasOne(DebuffItem::class, 'item_id');
    }
}
