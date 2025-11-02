<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\GetItemRequest;
use App\Http\Requests\GetWeaponRequest;
use App\Http\Requests\UseItemRequest;
use App\Http\Requests\ChangeWeaponRequest;
use App\Http\Requests\CatalogPageRequest;
use App\Http\Requests\MonsterEntryRequest;
use App\Models\Item;
use App\Models\Monster;
use App\Http\Requests\ClearBossRequest;
use App\Models\BossRecord;
use App\Models\User;
use App\Models\UserItem;
use App\Models\Weapon;

class MeController extends Controller
{
  const HTTP_UNAUTHORIZED = 401;
  const HTTP_SERVER_ERROR = 500;
  private const CATALOG_PER_PAGE = 20;

  private function getAuthenticatedUser(): User
  {
    $user = Auth::user();
    if (!$user instanceof User) {
      abort(401, 'Unauthorized');
    }
    return $user;
  }
  /**
   * @return JsonResponse ユーザー基本情報と装備武器データ
   */
  public function index(): JsonResponse
  {
    $user = User::with('weapon')->find(Auth::id());

    if (!$user) {
      return response()->json(['error' => 'Unauthorized'], self::HTTP_UNAUTHORIZED);
    }

    $userData = [
      'id' => $user->id,
      'name' => $user->name,
      'imageUrl' => $user->image_url,
      'level' => $user->level,
      'hitPoint' => $user->hit_point,
      'experiencePoint' => $user->experience_point,
      'weapon' => null
    ];

    if ($user->weapon) {
      $userData['weapon'] = [
        'id' => $user->weapon->id,
        'name' => $user->weapon->name,
        'imageUrl' => $user->weapon->image_url,
        'physicsAttack' => $user->weapon->physics_attack,
        'elementAttack' => $user->weapon->element_attack,
        'physicsType' => $user->weapon->physics_type,
        'elementType' => $user->weapon->element_type,
      ];
    }

    return response()->json($userData);
  }

  /**
   * アイテム一覧取得
   *
   * @return JsonResponse heal/buff/debuffアイテムの詳細情報配列
   */
  public function items(): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $userItems = $user->userItems()->with([
      'item.healItem',
      'item.buffItem',
      'item.debuffItem'
    ])->get();

    $itemsData = $userItems->map(function ($userItem) {
      $item = $userItem->item;

      $itemData = [
        'id' => $item->id,
        'name' => $item->name,
        'imageUrl' => $item->image_url,
        'effectType' => $item->effect_type,
        'count' => $userItem->count,
      ];

      return match ($item->effect_type) {
        'heal' => array_merge($itemData, ['amount' => $item->healItem?->amount]),
        'buff' => array_merge($itemData, [
          'rate' => (float) $item->buffItem?->rate,
          'target' => $item->buffItem?->target
        ]),
        'debuff' => array_merge($itemData, [
          'rate' => (float) $item->debuffItem?->rate,
          'target' => $item->debuffItem?->target
        ]),
        default => $itemData
      };
    });

    return response()->json($itemsData);
  }

  /**
   * ステータス更新処理
   *
   * @param UpdateUserRequest $request レベル、HP、経験値、武器ID、画像ファイル
   * @return JsonResponse 更新成功/失敗メッセージ
   */
  public function update(UpdateUserRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $validated = $request->validated();

    try {
      // 画像アップロード
      if (isset($validated['imageFile'])) {
        $path = Storage::disk('s3')->putFile('user_images', $validated['imageFile']);
        $user->image_url = config('filesystems.disks.s3.url') . '/' . $path;
      }

      // データ更新（null値の場合は既存値を保持）
      $user->update([
        'name' => $validated['name'] ?? $user->name,
        'level' => $validated['level'] ?? $user->level,
        'image_url' => $user->image_url,
        'hit_point' => $validated['hitPoint'] ?? $user->hit_point,
        'experience_point' => $validated['experiencePoint'] ?? $user->experience_point,
        'weapon_id' => $validated['weaponId'] ?? $user->weapon_id,
      ]);

      return response()->json([
        'success' => true,
        'messages' => ['ユーザー情報を更新しました。']
      ]);
    } catch (\Exception) {
      return response()->json([
        'success' => false,
        'messages' => ['更新に失敗しました。']
      ], self::HTTP_SERVER_ERROR);
    }
  }

  /**
   * アイテム報酬獲得処理
   *
   * @param GetItemRequest $request 獲得するアイテムID
   * @return JsonResponse 獲得成功/失敗メッセージ
   */
  public function getItem(GetItemRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $validated = $request->validated();
    $itemId = $validated['itemId'];

    try {
      DB::transaction(function () use ($user, $itemId) {
        // 既存レコードの有無を複合キーで判定し、クエリビルダで更新
        $query = UserItem::where('user_id', $user->id)
          ->where('item_id', $itemId);

        if ($query->exists()) {
          // 既存アイテムの場合、countを1増加（主キーidを使わない）
          $query->increment('count');
        } else {
          // 新規アイテムの場合、count=1で作成
          UserItem::create([
            'user_id' => $user->id,
            'item_id' => $itemId,
            'count' => 1,
          ]);
        }

        if (!$user->itemEntries()->wherePivot('item_id', $itemId)->exists()) {
          $user->itemEntries()->attach($itemId);
        }
      });

      return response()->json(null, 204);
    } catch (\Exception) {
      return response()->json([
        'success' => false,
        'messages' => ['アイテムの獲得に失敗しました。']
      ], self::HTTP_SERVER_ERROR);
    }
  }

  /**
   * 武器報酬獲得処理
   *
   * @param GetWeaponRequest $request 獲得する武器ID
   * @return JsonResponse 獲得成功/失敗メッセージ
   */
  public function getWeapon(GetWeaponRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $validated = $request->validated();
    $weaponId = $validated['weaponId'];

    try {
      DB::transaction(function () use ($user, $weaponId) {
        $this->registerCatalogEntry($user->ownedWeapons(), $weaponId);
        $this->registerCatalogEntry($user->weaponEntries(), $weaponId);
      });

      return response()->json(null, 204);
    } catch (\Throwable) {
      return response()->json([
        'success' => false,
        'messages' => ['武器の獲得に失敗しました。']
      ], self::HTTP_SERVER_ERROR);
    }
  }

  /**
   * モンスター図鑑登録処理
   *
   * @param MonsterEntryRequest $request 登録するモンスターID
   * @return JsonResponse
   */
  public function monsterEntry(MonsterEntryRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $monsterId = $request->validated()['monsterId'];

    try {
      $this->registerCatalogEntry($user->monsterEntries(), $monsterId);

      return response()->json(null, 204);
    } catch (\Throwable) {
      return response()->json([
        'success' => false,
        'messages' => ['モンスター図鑑の登録に失敗しました。']
      ], self::HTTP_SERVER_ERROR);
    }
  }

  /**
   * モンスター図鑑取得
   */
  public function monsterIndex(CatalogPageRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    return $this->catalogIndex(
      $request,
      Monster::query(),
      $user->monsterEntries(),
      fn(Monster $monster) => $monster->id,
      fn(Monster $monster) => [
        'id' => (string) $monster->id,
        'name' => $monster->name,
        'imageUrl' => $monster->image_url,
      ],
    );
  }

  /**
   * 武器図鑑取得
   */
  public function weaponIndex(CatalogPageRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    return $this->catalogIndex(
      $request,
      Weapon::query(),
      $user->weaponEntries(),
      fn(Weapon $weapon) => $weapon->id,
      fn(Weapon $weapon) => [
        'id' => (int) $weapon->id,
        'name' => $weapon->name,
        'imageUrl' => $weapon->image_url,
        'physicsAttack' => $weapon->physics_attack,
        'elementAttack' => $weapon->element_attack,
        'physicsType' => $weapon->physics_type,
        'elementType' => $weapon->element_type,
      ],
    );
  }

  /**
   * アイテム図鑑取得
   */
  public function itemIndex(CatalogPageRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    return $this->catalogIndex(
      $request,
      Item::query(),
      $user->itemEntries(),
      fn(Item $item) => $item->id,
      function (Item $item) {
        $base = [
          'id' => (int) $item->id,
          'name' => $item->name,
          'imageUrl' => $item->image_url,
          'effectType' => $item->effect_type,
        ];

        $extra = match ($item->effect_type) {
          'heal' => ['amount' => $item->healItem->amount],
          'buff' => [
            'rate' => $item->buffItem->rate,
            'target' => $item->buffItem->target,
          ],
          'debuff' => [
            'rate' => $item->debuffItem->rate,
            'target' => $item->debuffItem->target,
          ],
          default => [],
        };

        return [...$base, ...$extra];
      }
    );
  }

  /**
   * 図鑑のページング結果から、ユーザーが発見済みのエントリのみを抽出して返す。
   *
   * @param CatalogPageRequest $request ページ番号のバリデーション済みリクエスト
   * @param Builder $query 図鑑マスター用クエリビルダ（index_number順でソート可能なもの）
   * @param BelongsToMany $relation ユーザーと図鑑マスターを結ぶ多対多リレーション
   * @param callable $modelKeyResolver モデルからレスポンス用IDを取り出すクロージャ
   * @param callable $presenter 発見済みデータをレスポンス配列に整形するクロージャ
   * @return JsonResponse 発見済みデータ（未発見はnull）とページングヘッダを含むレスポンス
   */
  private function catalogIndex(
    CatalogPageRequest $request,
    Builder $query,
    BelongsToMany $relation,
    callable $modelKeyResolver,
    callable $presenter
  ): JsonResponse {
    $currentPage = $request->validated()['currentPage'];

    $paginator = $query->orderBy('index_number')
      ->paginate(self::CATALOG_PER_PAGE, ['*'], 'page', $currentPage);

    $collection = $paginator->getCollection();
    $pageIds = $collection->pluck('id')->all();

    $discoveredIds = empty($pageIds)
      ? []
      : $relation->wherePivotIn($relation->getRelatedPivotKeyName(), $pageIds)
      ->pluck($relation->getQualifiedRelatedPivotKeyName())
      ->map(fn($id) => (string) $id)
      ->all();

    $lookup = array_fill_keys($discoveredIds, true);

    $payload = $collection->map(function ($model) use ($lookup, $modelKeyResolver, $presenter) {
      $key = (string) $modelKeyResolver($model);

      if (!isset($lookup[$key])) {
        return null;
      }

      return $presenter($model);
    })->values()->all();

    return $this->catalogResponse($payload, $paginator);
  }

  /**
   * 多対多リレーションを介して図鑑エントリを登録（重複は無視）する。
   *
   * @param BelongsToMany $relation 登録対象の多対多リレーション
   * @param int|string $id 登録したい図鑑エントリID
   * @return void
   */
  private function registerCatalogEntry(BelongsToMany $relation, int|string $id): void
  {
    $relation->syncWithoutDetaching([$id]);
  }

  private function catalogResponse(array $payload, LengthAwarePaginator $paginator): JsonResponse
  {
    return response()
      ->json($payload)
      ->header('X-Total-Page', (string) $paginator->lastPage())
      ->header('Access-Control-Expose-Headers', 'X-Total-Page');
  }

  /**
   * アイテム使用処理
   *
   * @param UseItemRequest $request 使用するアイテムID
   * @return JsonResponse 使用成功/失敗メッセージ
   */
  public function useItem(UseItemRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $validated = $request->validated();
    $itemId = $validated['itemId'];

    try {
      return DB::transaction(function () use ($user, $itemId) {
        // ユーザーが所持しているアイテムを検索
        $userItem = UserItem::where('user_id', $user->id)
          ->where('item_id', $itemId)
          ->first();

        if (!$userItem) {
          return response()->json([
            'success' => false,
            'messages' => ['指定されたアイテムを所持していません。']
          ], 400);
        }

        if ($userItem->count <= 0) {
          return response()->json([
            'success' => false,
            'messages' => ['アイテムの在庫がありません。']
          ], 400);
        }

        // countを1減算（主キーidを使わない）
        UserItem::where('user_id', $user->id)
          ->where('item_id', $itemId)
          ->where('count', '>', 0)
          ->decrement('count');

        // 減算後に0になった場合はレコードを削除
        if ($userItem->count <= 1) {
          UserItem::where('user_id', $user->id)
            ->where('item_id', $itemId)
            ->delete();
        }

        return response()->json(null, 204);
      });
    } catch (\Exception) {
      return response()->json([
        'success' => false,
        'messages' => ['アイテムの使用に失敗しました。']
      ], self::HTTP_SERVER_ERROR);
    }
  }

  /**
   * 所持武器一覧表示
   *
   * @return JsonResponse 所持武器の詳細情報配列
   */
  public function weapon(): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $ownedWeapons = $user->ownedWeapons()->get();

    $weaponsData = $ownedWeapons->map(function ($weapon) {
      return [
        'id' => $weapon->id,
        'name' => $weapon->name,
        'imageUrl' => $weapon->image_url,
        'physicsAttack' => $weapon->physics_attack,
        'elementAttack' => $weapon->element_attack,
        'physicsType' => $weapon->physics_type,
        'elementType' => $weapon->element_type,
      ];
    });

    return response()->json($weaponsData);
  }

  /**
   * 装備武器変更処理
   *
   * @param ChangeWeaponRequest $request 装備する武器ID
   * @return JsonResponse 装備成功/失敗メッセージ
   */
  public function changeWeapon(ChangeWeaponRequest $request): JsonResponse
  {
    $user = $this->getAuthenticatedUser();

    $validated = $request->validated();
    $weaponId = $validated['weaponId'];

    try {
      return DB::transaction(function () use ($user, $weaponId) {
        // ユーザーが武器を所持しているかチェック
        $ownsWeapon = DB::table('user_weapons')
          ->where('user_id', $user->id)
          ->where('weapon_id', $weaponId)
          ->exists();

        if (!$ownsWeapon) {
          return response()->json([
            'success' => false,
            'messages' => ['指定された武器を所持していません。']
          ], 400);
        }

        // 装備中武器を更新
        $user->update([
          'weapon_id' => $weaponId
        ]);

        return response()->json(null, 204);
      });
    } catch (\Exception) {
      return response()->json([
        'success' => false,
        'messages' => ['武器の変更に失敗しました。']
      ], self::HTTP_SERVER_ERROR);
    }
  }

  public function clearBoss(ClearBossRequest $request)
  {
    $user = $this->getAuthenticatedUser();
    $validated = $request->validated();
    try {
      BossRecord::create([
        'user_id' => $user->id,
        'clear_time' => $validated['clearTime'],
      ]);
      return response()->json([
        'success' => true,
        'messages' => ['クリア時間の追加が成功しました'],
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'messages' => ['クリア時間の追加が失敗しました']
      ], 500);
    }
  }
}
