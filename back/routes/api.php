<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\WeaponController;
Route::post('/auth/user-login', [AuthController::class, 'userLogin']);
Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/user', [UserController::class, 'store']);
    Route::get('/item', [ItemController::class, 'index']);
    Route::post('/item', [ItemController::class, 'store']);
    Route::get('/weapon', [WeaponController::class, 'index']);
    Route::post('/weapon', [WeaponController::class, 'store']);
});
