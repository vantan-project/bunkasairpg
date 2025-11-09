<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BossRecord extends Model
{
  protected $primaryKey = 'user_id';
  public $incrementing = false;
  protected $keyType = 'string';

  protected $fillable = [
    'user_id',
    'clear_time',
  ];

  public function user()
  {
    return $this->belongsTo(User::class, 'user_id');
  }
}
