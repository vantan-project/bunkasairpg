<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserStoreRequest;
use App\Models\User;
use Exception;

class UserController extends Controller
{
    protected int $DEFAULT_MAX_HIT_POINT = 35;
    protected int $DEFAULT_HIT_POINT = 35;

    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();
        try {
            User::create([
                'name' => $validated['name'],
                'max_hit_point' => $this->DEFAULT_MAX_HIT_POINT,
                'hit_point' => $this->DEFAULT_HIT_POINT,
            ]);
            return response()->json([
                'success' => true,
                'messages' => ['ユーザーを作成しました。']
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'messages' => ['ユーザーの作成が失敗しました。']
            ], 500);
        }
    }
}
