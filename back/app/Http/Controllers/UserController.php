<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserStoreRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Monster;
use App\Models\Item;
use App\Models\Weapon;
use App\Models\BossRecord;
use Illuminate\Support\Facades\DB;
use Exception;

class UserController extends Controller
{
    protected int $DEFAULT_MAX_HIT_POINT = 35;
    protected int $DEFAULT_HIT_POINT = 35;

    private function getAuthenticatedUser(): User
    {
        $user = Auth::user();
        if (!$user instanceof User) {
            abort(401, 'Unauthorized');
        }
        return $user;
    }

    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();
        try {
            $user = User::create([
                'name' => $validated['name'],
                'max_hit_point' => $this->DEFAULT_MAX_HIT_POINT,
                'hit_point' => $this->DEFAULT_HIT_POINT,
            ]);

            return response()->json([
                'id' => $user->id,
                'success' => true,
                'messages' => ['ユーザーを作成しました。'],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'messages' => ['ユーザーの作成が失敗しました。']
            ], 500);
        }
    }

    public function heal($id)
    {
        $user = User::findOrFail($id);
        $user->hit_point = $user->max_hit_point;
        $user->save();

        return response()->json([
            'success' => true,
            'messages' => ['ユーザーを全回復しました']
        ]);
    }
    public function clearRanking()
    {
        $user = $this->getAuthenticatedUser();

        // 全体のランキング
        $bossRecords = BossRecord::with('user')
            ->orderBy('clear_time', 'asc')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->values()
            ->map(function ($record, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => $record->user->name,
                    'imageUrl' => $record->user->image_url,
                    'clearTime' => $record->clear_time,
                ];
            });
        // 自分のランキング
        $bossRecord = DB::table('boss_records')
            ->select('user_id', 'clear_time', DB::raw('ROW_NUMBER() OVER (ORDER BY clear_time ASC) AS `rank`'))
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'userRanking' => [
                'name' => $user->name,
                'imageUrl' => $user->image_url,
                'rank' => $bossRecord ? $bossRecord->rank + 1 : null,
                'clearTime' => $bossRecord?->clear_time
            ],
            'rankings' => $bossRecords,
        ]);
    }

    public function collectedRanking()
    {
        $user = $this->getAuthenticatedUser();

        $totalAvailableCount = Monster::count() + Item::count() + Weapon::count();
        //パーセント計算(例60.33)
        $calcPercentage = function ($partial) use ($totalAvailableCount) {
            return round(($partial / $totalAvailableCount) * 100, 2);
        };

        //全体のランキング
        $rankingUsers = User::query()
            ->select('users.*')
            ->selectRaw(
                '
                    (
                        SELECT COUNT(DISTINCT item_id)
                        FROM item_entries
                        WHERE item_entries.user_id = users.id
                    ) +
                    (
                        SELECT COUNT(DISTINCT monster_id)
                        FROM monster_entries
                        WHERE monster_entries.user_id = users.id
                    ) +
                    (
                        SELECT COUNT(DISTINCT weapon_id)
                        FROM weapon_entries
                        WHERE weapon_entries.user_id = users.id
                    ) AS total_count
                ',
            )
            ->orderByDesc('total_count')
            ->orderByDesc('users.created_at')
            ->limit(20)
            ->get()
            ->values()
            ->map(function ($u, $index) use ($calcPercentage) {
                return [
                    'rank' => $index + 1,
                    'name' => $u->name,
                    'image_url' => $u->image_url,
                    'collection_rate' => $calcPercentage($u->total_count),
                ];
            });

        $subQuery = User::query()
            ->leftJoin('item_entries', 'item_entries.user_id', '=', 'users.id')
            ->leftJoin('monster_entries', 'monster_entries.user_id', '=', 'users.id')
            ->leftJoin('weapon_entries', 'weapon_entries.user_id', '=', 'users.id')
            ->select('users.*')
            ->selectRaw('
                    COUNT(DISTINCT item_entries.item_id)
                    + COUNT(DISTINCT monster_entries.monster_id)
                    + COUNT(DISTINCT weapon_entries.weapon_id)
                    AS total_count,
                    ROW_NUMBER() OVER (
                        ORDER BY
                            COUNT(DISTINCT item_entries.item_id)
                            + COUNT(DISTINCT monster_entries.monster_id)
                            + COUNT(DISTINCT weapon_entries.weapon_id) DESC,
                            users.created_at DESC
                    ) AS `rank`
                ')
            ->groupBy('users.id');
        $userRanking = DB::table(DB::raw("({$subQuery->toSql()}) as ranked"))
            ->mergeBindings($subQuery->getQuery())
            ->where('id', $user->id)
            ->first();

        return response()->json([
            'userRanking' => [
                'rank' => $userRanking->rank,
                'name' => $user->name,
                'image_url' => $user->image_url,
                'collection_rate' => $calcPercentage($userRanking->total_count),
            ],
            'rankings' => $rankingUsers
        ]);
    }
}
