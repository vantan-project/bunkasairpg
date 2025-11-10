<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Item extends Model
{
    protected $fillable = [
        'name',
        'image_url',
        'index_number',
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

    public function itemEntries()
    {
        return $this->belongsToMany(User::class, 'item_entries', 'item_id', 'user_id')->withTimestamps();
    }
}
