<?php

namespace App\Console\Commands;

use App\Models\Item;
use App\Models\Monster;
use App\Models\Weapon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class S3Clear extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 's3:clear';

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
    $targets = [
      'monster_images' => Monster::pluck('image_url')->toArray(),
      'item_images'    => Item::pluck('image_url')->toArray(),
      'weapon_images'   => Weapon::pluck('image_url')->toArray(),
    ];

    foreach ($targets as $dir => $urls) {
      $this->info("S3上のファイル一覧を取得中... ディレクトリ: {$dir}");
      $allFiles = Storage::disk('s3')->allFiles($dir);

      $this->info("DB上の {$dir} の image_url を取得中...");

      // URLをS3のキー形式に正規化
      $usedPaths = array_map(function ($url) {
        if (filter_var($url, FILTER_VALIDATE_URL)) {
          return ltrim(parse_url($url, PHP_URL_PATH), '/');
        }
        return ltrim($url, '/');
      }, array_filter($urls));

      $unusedFiles = array_filter($allFiles, function ($file) use ($usedPaths) {
        return !in_array($file, $usedPaths);
      });

      if (empty($unusedFiles)) {
        $this->info("{$dir}: 削除対象の未使用ファイルはありません。");
        continue;
      }

      $this->warn("{$dir}: 未使用ファイルの削除を開始します...");

      foreach ($unusedFiles as $file) {
        Storage::disk('s3')->delete($file);
        $this->line("削除: {$file}");
      }

      $this->info("{$dir}: 未使用ファイルの削除が完了しました。");
    }

    return Command::SUCCESS;
  }
}
