<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Monster;
use App\Http\Requests\MonsterIndexRequest;
use App\Http\Requests\MonsterStoreRequest;
use App\Models\Weapon;
use App\Models\Item;
use Exception;

class MonsterController extends Controller
{
  /**
   * モンスター一覧取得（検索・ソート・ページネーション機能付き）
   *
   * @param MonsterIndexRequest $request
   * @return JsonResponse
   */
  public function index(MonsterIndexRequest $request): JsonResponse
  {
    try {
      $validated = $request->validated();
      $query = Monster::query();

      // 検索機能（名前での部分一致検索）
      if (isset($validated['name']) && $validated['name'] !== '') {
        $query->where('name', 'like', '%' . $validated['name'] . '%');
      }

      // ソート機能
      $sortOptions = [
        'createdAt' => 'created_at',
        'updatedAt' => 'updated_at',
        'name' => 'name',
        'attack' => 'attack',
        'hitPoint' => 'hit_point',
        'experiencePoint' => 'experience_point',
      ];
      $sortColumn = $sortOptions[$validated['sort']];
      $sortDirection = $validated['desc'] ? 'desc' : 'asc';
      $query->orderBy($sortColumn, $sortDirection);

      // ページネーション（40件/ページ）
      $currentPage = $validated['currentPage'] ?? 1;
      $monsters = $query->paginate(40, ['*'], 'page', $currentPage);

      $formattedMonsters = $monsters->map(function ($monster) {
        return [
          'id' => $monster->id,
          'imageUrl' => $monster->image_url,
        ];
      });

      return response()->json($formattedMonsters)
        ->header('X-Total-Page', $monsters->lastPage())
        ->header('Access-Control-Expose-Headers', 'X-Total-Page');
    } catch (Exception $e) {
      return response()->json([
        'messages' => ['モンスター一覧の取得に失敗しました'],
      ], 500);
    }
  }

  /**
   * モンスター作成
   *
   * @param MonsterStoreRequest $request
   * @return JsonResponse
   */
  public function store(MonsterStoreRequest $request): JsonResponse
  {
    try {
      $validated = $request->validated();

      DB::transaction(function () use ($validated) {
        $url = null;
        if (isset($validated['imageFile'])) {
          $path = Storage::disk('s3')->putFile('monster_images', $validated['imageFile']);
          $url = config('filesystems.disks.s3.url') . '/' . $path;
        }

        Monster::create([
          'weapon_id' => $validated['weaponId'] ?? null,
          'item_id' => $validated['itemId'] ?? null,
          'index_number' => $validated['indexNumber'],
          'name' => $validated['name'],
          'image_url' => $url,
          'attack' => $validated['attack'],
          'hit_point' => $validated['hitPoint'],
          'experience_point' => $validated['experiencePoint'],
          'slash' => $validated['slash'],
          'blow' => $validated['blow'],
          'shoot' => $validated['shoot'],
          'neutral' => $validated['neutral'],
          'flame' => $validated['flame'],
          'water' => $validated['water'],
          'wood' => $validated['wood'],
          'shine' => $validated['shine'],
          'dark' => $validated['dark'],
        ]);
      });

      return response()->json([
        'success' => true,
        'messages' => ['モンスターを作成しました。']
      ]);
    } catch (Exception $e) {
      return response()->json([
        'success' => false,
        'messages' => ['モンスターの作成に失敗しました。'],
      ], 500);
    }
  }

  /**
   * モンスター詳細取得（バトル画面用）
   *
   * @param Monster $monster
   * @return JsonResponse
   */
  public function show(Monster $monster): JsonResponse
  {
    try {
      $weapon = null;
      if (isset($monster->weapon_id)) {
        $weaponModel = Weapon::query()->select([
          'id',
          'name',
          'image_url',
          'physics_type',
          'element_type'
        ])
          ->find($monster->weapon_id);
        if ($weaponModel) {
          $weapon = [
            'id' => (int) $weaponModel->id,
            'name' => $weaponModel->name,
            'imageUrl' => $weaponModel->image_url,
            'physicsType' => $weaponModel->physics_type,
            'elementType' => $weaponModel->element_type,
          ];
        }
      }

      $item = null;
      if (isset($monster->item_id)) {
        $itemModel = Item::query()->select([
          'id',
          'name',
          'image_url',
          'effect_type'
        ])
          ->find($monster->item_id);
        if ($itemModel) {
          $item = [
            'id' => (int) $itemModel->id,
            'name' => $itemModel->name,
            'imageUrl' => $itemModel->image_url,
            'effectType' => $itemModel->effect_type,
          ];
        }
      }

      return response()->json([
        'name' => $monster->name,
        'imageUrl' => $monster->image_url,
        'attack' => (int) $monster->attack,
        'maxHitPoint' => (int) $monster->hit_point,
        'hitPoint' => (int) $monster->hit_point,
        'experiencePoint' => (int) $monster->experience_point,
        'slash' => (float) $monster->slash,
        'blow' => (float) $monster->blow,
        'shoot' => (float) $monster->shoot,
        'neutral' => (float) $monster->neutral,
        'flame' => (float) $monster->flame,
        'water' => (float) $monster->water,
        'wood' => (float) $monster->wood,
        'shine' => (float) $monster->shine,
        'dark' => (float) $monster->dark,
        'weapon' => $weapon,
        'item' => $item,
      ]);
    } catch (Exception $e) {
      return response()->json([
        'messages' => ['モンスター情報の取得に失敗しました'],
      ], 500);
    }
  }

  public function destroy($id)
  {
    try {
      $item = Monster::find($id);
      $item->delete();

      return response()->json([
        'success' => true,
        'message' => '正常に削除されました！',
      ]);
    } catch (Exception $e) {
      return response()->json([
        'success' => false,
        'messages' => ['削除に失敗しました！'],
      ], 500);
    }
  }
}
