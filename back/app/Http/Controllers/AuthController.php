<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\AdminLoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;

class AuthController extends Controller
{
    public function userLogin(UserLoginRequest $request)
    {
        try {
            $validated = $request->validated();
            $user = User::find($validated['id']);

            if (!$user) {
                return response()->json([
                    'messages' => ['ユーザーが見つかりません。']
                ], 401);
            }

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'authToken' => $token
            ]);
        } catch (Exception $e) {
            return response()->json([
                'messages' => ['ログインに失敗しました'],
            ], 500);
        }
    }
    public function adminLogin(AdminLoginRequest $request)
    {
        try {
            $validated = $request->validated();

            if (Auth::guard('admin')->attempt([
                'email' => $validated['email'],
                'password' => $validated['password'],
            ])) {
                $user = Auth::guard('admin')->user();

                $user->tokens()->delete();
                $token = $user->createToken('token')->plainTextToken;

                return response()->json([
                    "success" => true,
                    'messages' => ["ログインに成功しました"],
                    'token' => $token,
                ]);
            } else {
                return response()->json([
                    "success" => false,
                    'messages' => ["メールアドレスまたはパスワードが間違っています"]
                ], 401);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'messages' => ['ログインに失敗しました'],
            ], 500);
        }
    }
}
