<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Monster;
use App\Http\Requests\MonsterIndexRequest;
use App\Http\Requests\MonsterStoreRequest;
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
                ->header('X-TOTAL-PAGE', $monsters->lastPage());

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
}
