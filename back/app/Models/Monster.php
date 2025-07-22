<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Monster extends Model
{
    /**
     * UUIDを主キーとして使用
     */
    public $incrementing = false;
    protected $keyType = 'string';

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
        'wood',
        'shine',
        'dark',
    ];

    /**
     * モデル作成時に自動でUUIDを生成
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
