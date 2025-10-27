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
    $userRecord= $user->bossRecord;
    $bossRecords = BossRecord::with('user')
        ->orderBy('clear_time', 'asc')
        ->get();
    $userRecordData = [];

    if ($userRecord) {
        $userRecordData = [
            'name' => $user->name,
            'image_url' => $user->image_url,
            'clear_time' => $userRecord->clear_time,
        ];
    }
    $rankingList = $bossRecords->map(function ($record) {
        return[
            'name' => $record->user->name,
            'image_url' => $record->user->image_url,
            'clear_time' => $record->clear_time,
        ];
    });
    return response()->json([
        'userRanking' => $userRecordData,
        'rankings' => $rankingList,
    ]);
  }
  public function collectedRanking(){
    $user = $this->getAuthenticatedUser();
    $rankingUsers = User::withCount(['items', 'monsters', 'weapons'])
        ->get()
        ->map(function  ($u){
            $u->total_count = $u->items_count + $u->monsters_count + $u->weapons_count;
            return $u;
        })
        ->sortByDesc('created_at')
        ->sortByDesc('total_count')
        ->take(20);

    $totalAvailableCount = Monster::count() + Item::count() + Weapon::count();
    $userTotalCount = $user->items()->count() + $user->monsters()->count() + $user->weapons()->count();

    //パーセント計算(例60.33)
    $calcPercentage = function ($partial) use ($totalAvailableCount) {
        return round(($partial / $totalAvailableCount) * 100, 2);
    };

    $userRanking = [
        'name' => $user->name,
        'image_url' => $user->image_url,
        'user_percentage' => $calcPercentage($userTotalCount),
    ];

    $rankings = $rankingUsers->map(function ($u) use ($calcPercentage) {
        return [
            'name' => $u->name,
            'image_url' => $u->image_url,
            'total' => $calcPercentage($u->total_count),
        ];
    })->values();

    return response()->json([
        'userRanking' => $userRanking,
        'rankings' => $rankings
    ]);
  }
}
