<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Http\Requests\ItemIndexRequest;
use App\Http\Requests\ItemStoreRequest;

class ItemController extends Controller
{
    //ページネーション(currentPage)と検索(name)と絞り込み(effectType)と並び替え(sort,desc)
    public function index(ItemIndexRequest $request)
    {
        $validated = $request->validated();
        $query = Item::query();
        //検索機能
        if (!empty($validated['name'])) {
            $query->where('name', 'like', '%' . $validated['name'] . '%');
        }
        //絞り込み
        if (!empty($validated['effectType'])) {
            $query->where('effect_type', $validated['effectType']);
        }
        //並び替え処理
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
        $items = $query->paginate(件数, ['*'], 'page', $currentPage);
        $formattedItems = $items->map(function ($item) {
            return[
                'id' => $item->id,
                'name' => $item->name,
                'imageUrl' => $item->imageUrl,
                'effectType' => $item->effectType,
            ];
        });
        return response()->json([
            'items' => $formattedItems
        ]);
    }

    public function store(ItemStoreRequest $request)
    {
        $validated = $request->validated();
        if (isset($validated['imageFile'])) {
            $path = Storage::disk('s3')->putFile('item_images', $validated['imageFile']);
            $url = config('filesystems.disks.s3.url') . '/' . $path;
        }
        $item = Item::create([
            'name' => $validated['name'],
            'image_url' => $url ?? null,
            'effect_type' => $validated['effect_type'],
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
        return response()->json([
            'success' => true,
            'message' => 'アイテムを作成しました。'
        ]);
    }
}
