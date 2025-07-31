<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Weapon;
use App\Http\Requests\WeaponIndexRequest;
use App\Http\Requests\WeaponStoreRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Exception;

class WeaponController extends Controller
{
    public function index(WeaponIndexRequest $request)
    {
        try{
            $validated = $request->validated();
            $query = Weapon::query();
            //検索
            if (!empty($validated['name'])) {
                $query->where('name', 'like', '%' . $validated['name'] . '%');
            }
            //絞り込み
            if (isset($validated['physicsType'])) {
                $query->where('physics_type', $validated['physicsType']);
            }

            if (isset($validated['elementType'])) {
                $query->where('element_type', $validated['elementType']);
            }
            //並び替え
            $sortOptions = [
                'createdAt' => 'created_at',
                'updatedAt' => 'updated_at',
                'physicsAttack' => 'physics_attack',
                'elementType' => 'element_type',
                'name' => 'name',
            ];
            $sortColumn = $sortOptions[$validated['sort']];
            $sortDirection = $validated['desc'] ? 'desc' : 'asc';
            $query->orderBy($sortColumn, $sortDirection);
            //ページネーション
            $currentPage = $validated['currentPage'] ?? 1;
            $weapons = $query->paginate(40, ['*'], 'page', $currentPage);
            $formattedWeapons = $weapons->map(function ($weapon) {
                return[
                    'id' => $weapon->id,
                    'name' => $weapon->name,
                    'imageUrl' => $weapon->image_url,
                    'physicsType' => $weapon->physics_type,
                    'elementType' => $weapon->element_type,
                ];
            });
            return response()->json([
                'weapons' => $formattedWeapons
            ]);
        } catch (Exception $e) {
            return response()->json([
                'messages' => ['武器一覧の取得に失敗しました'],
            ], 500);
        }
    }

    public function store(WeaponStoreRequest $request)
    {
        try{
            $validated = $request->validated();
            DB::transaction(function () use ($validated) {
                $url = null;
                if (isset($validated['imageFile'])) {
                    $path = Storage::disk('s3')->putFile('weapon_images', $validated['imageFile']);
                    $url = config('filesystems.disks.s3.url') . '/' . $path;
                }
                $weapon = Weapon::create([
                    'name' => $validated['name'],
                    'image_url' => $url,
                    'physics_attack' => $validated['physicsAttack'],
                    'element_attack' => $validated['elementAttack'] ?? null,
                    'physics_type' => $validated['physicsType'],
                    'element_type' => $validated['elementType'],
                ]);
            });
            return response()->json([
                'success' => true,
                'message' => '武器を作成しました。'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'messages' => ['武器の作成に失敗しました。'],
            ], 500);
        }
    }
}
