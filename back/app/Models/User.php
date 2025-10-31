<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * UUIDを主キーとして使用
     */
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'weapon_id',
        'name',
        'image_url',
        'level',
        'hit_point',
        'experience_point',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

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

    public function weapon()
    {
        return $this->belongsTo(Weapon::class, 'weapon_id');
    }

    public function userItems()
    {
        return $this->hasMany(UserItem::class, 'user_id');
    }

    public function ownedWeapons()
    {
        return $this->belongsToMany(Weapon::class, 'user_weapons', 'user_id', 'weapon_id')->withTimestamps();
    }

    public function monsterEntries()
    {
        return $this->belongsToMany(Monster::class, 'monster_entries', 'user_id', 'monster_id')->withTimestamps();
    }

    public function weaponEntries()
    {
        return $this->belongsToMany(Weapon::class, 'weapon_entries', 'user_id', 'weapon_id')->withTimestamps();
    }

    public function itemEntries()
    {
        return $this->belongsToMany(Item::class, 'item_entries', 'user_id', 'item_id')->withTimestamps();
    }
    public function bossRecord()
    {
        return $this->hasOne(BossRecord::class, 'user_id');
    }

    public function monsters()
    {
        return $this->belongsToMany(Monster::class, 'monster_entries', 'user_id', 'monster_id');
    }
    public function weapons()
    {
        return $this->belongsToMany(Weapon::class, 'weapon_entries', 'user_id', 'weapon_id');
    }
    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_entries', 'user_id', 'item_id');
    }
}
