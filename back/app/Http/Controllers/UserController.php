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
    $userRanking = $user->bossRecord;
    $rankings = BossRecord::with('user')->get();
    $userRankingData = [];

    if ($userRanking) {
        $userRankingData = [
            'name' => $user->name,
            'image_url' => $user->image_url,
            'clear_time' => $userRanking->clear_time,
        ];
    }
    $rankingData = $rankings->map(function ($ranking) {
        return[
            'name' => $ranking->user->name,
            'image_url' => $ranking->user->image_url,
            'clear_time' => $ranking->clear_time,
        ];
    });
    return response()->json([
        'userRanking' => $userRankingData,
        'rankings' => $rankingData,
    ]);
  }
  public function collectedRanking(){
    $user = $this->getAuthenticatedUser();
    $users = User::withCount(['items', 'monsters', 'weapons'])->get();
    $counts = [
        Monster::count(),
        Item::count(),
        Weapon::count(),
    ];
    $userCounts = [
        $user->items()->count(),
        $user->monsters()->count(),
        $user->weapons()->count(),
    ];


    $totalCount = array_sum($counts);
    $totalUserCount = array_sum($userCounts);
    $userData = [
        'name' => $user->name,
        'image_url' => $user->image_url,
        'user_percentage' => round(($totalUserCount / $totalCount) * 100, 2),
    ];
    $userDatas = $users->map(function ($user) use ($totalCount) {
        $total = $user->items_count + $user->monsters_count + $user->weapons_count;
        return [
            'name' => $user->name,
            'image_url' => $user->image_url,
            'total' => round(($total / $totalCount) * 100, 2),
        ];
    });

    return response()->json([
        'userRanking'=> $userData,
        'userRankings' => $userDatas
    ]);
  }
}
