<?php

namespace App\Console\Commands;

use App\Models\Item;
use App\Models\Monster;
use App\Models\Weapon;
use Illuminate\Console\Command;

class RpgClear extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'rpg:clear';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Command description';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $models = [
      'items'    => Item::class,
      'monsters' => Monster::class,
      'weapons'  => Weapon::class,
    ];

    foreach ($models as $table => $model) {
      // if ($table === 'monsters') {
      //   // 特定IDを除いて削除
      //   $excludeId = 'd016cbed-1e63-47ef-ae97-a7cbfba0e085';
      //   $count = $model::where('id', '!=', $excludeId)->count();
      //   $model::where('id', '!=', $excludeId)->delete();
      //   $this->info("{$table} テーブルの {$count} 件を削除しました。（{$excludeId} は残しました）");
      // } else {
      // deleteで全削除
      $count = $model::count();
      $model::query()->delete();
      $this->info("{$table} テーブルの {$count} 件を削除しました。");
      // }
    }

    $this->info('items, monsters, weapons のデータをクリアしました。');
    return Command::SUCCESS;
  }
}
