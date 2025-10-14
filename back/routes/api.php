<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\WeaponController;
use App\Http\Controllers\MonsterController;

Route::post('/auth/user-login', [AuthController::class, 'userLogin']);
Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);

// ユーザー系
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/me', [MeController::class, 'index']);
  Route::get('/me/item', [MeController::class, 'items']);
  Route::patch('/me', [MeController::class, 'update']);
  Route::post('/me/get-item', [MeController::class, 'getItem']);
  Route::post('/me/get-weapon', [MeController::class, 'getWeapon']);
  Route::patch('/me/use-item', [MeController::class, 'useItem']);
  Route::get('/me/weapon', [MeController::class, 'weapon']);
  Route::patch('/me/change-weapon', [MeController::class, 'changeWeapon']);
  Route::get('/monster/{monster}', [MonsterController::class, 'show']);
});

// 管理者系
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
  Route::get('/admin-token', function (Request $request) {
    return response()->json([
      'success' => true,
    ]);
  });

  Route::post('/user', [UserController::class, 'store']);
  Route::patch('/user/heal/{id}', [UserController::class, 'heal']);
  Route::get('/item', [ItemController::class, 'index']);
  Route::post('/item', [ItemController::class, 'store']);
  Route::delete('/item/{id}', [ItemController::class, 'destroy']);
  Route::get('/weapon', [WeaponController::class, 'index']);
  Route::post('/weapon', [WeaponController::class, 'store']);
  Route::delete('/weapon/{id}', [WeaponController::class, 'destroy']);
  Route::get('/monster', [MonsterController::class, 'index']);
  Route::post('/monster', [MonsterController::class, 'store']);
  Route::delete('/monster/{id}', [MonsterController::class, 'destroy']);
});
