<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Http\Requests\ItemIndexRequest;
use App\Http\Requests\ItemStoreRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Exception;

class ItemController extends Controller
{
    public function index(ItemIndexRequest $request)
    {
        try{
            $validated = $request->validated();
            $query = Item::query();
            //検索
            if (isset($validated['name']) && $validated['name'] !== '') {
                $query->where('name', 'like', '%' . $validated['name'] . '%');
            }
            //絞り込み
            if (isset($validated['effectType'])) {
                $query->where('effect_type', $validated['effectType']);
            }
            //並び替え
            $sortOptions = [
                'createdAt' => 'created_at',
                'updatedAt' => 'updated_at',
                'name' => 'name',
            ];
            $sortColumn = $sortOptions[$validated['sort']];
            $sortDirection = $validated['desc'] ? 'desc' : 'asc';
            $query->orderBy($sortColumn, $sortDirection);
            //ページネーション
            $currentPage = $validated['currentPage'] ?? 1;
            $items = $query->paginate(40, ['*'], 'page', $currentPage);

            $formattedItems = $items->map(function ($item) {
                return[
                    'id' => $item->id,
                    'name' => $item->name,
                    'imageUrl' => $item->image_url,
                    'effectType' => $item->effect_type,
                ];
            });
            return response()->json([
                'items' => $formattedItems
            ]);
        } catch (Exception $e) {
            return response()->json([
                'messages' => ['アイテム一覧の取得に失敗しました'],
            ], 500);
        }
    }

    public function store(ItemStoreRequest $request)
    {
        try{
            $validated = $request->validated();
            DB::transaction(function () use ($validated) {
                $url = null;
                if (isset($validated['imageFile'])) {
                    $path = Storage::disk('s3')->putFile('item_images', $validated['imageFile']);
                    $url = config('filesystems.disks.s3.url') . '/' . $path;
                }
                $item = Item::create([
                    'name' => $validated['name'],
                    'image_url' => $url,
                    'effect_type' => $validated['effectType'],
                ]);
                if ($item->effect_type === 'heal') {
                    $item->healItem()->create([
                        'amount' => $validated['amount'],
                    ]);
                } elseif ($item->effect_type === 'buff') {
                    $item->buffItem()->create([
                        'rate' => $validated['rate'],
                        'target' => $validated['target'],
                    ]);
                } elseif ($item->effect_type === 'debuff') {
                    $item->debuffItem()->create([
                        'rate' => $validated['rate'],
                        'target' => $validated['target'],
                    ]);
                }
            });
            return response()->json([
                'success' => true,
                'messages' => ['アイテムを作成しました。']
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'messages' => ['アイテムの作成に失敗しました。'],
            ], 500);
        }
    }
}
