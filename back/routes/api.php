<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;

Route::post('/auth/user-login', [AuthController::class, 'userLogin']);
Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);

// Route::middleware('auth:admin')->group(function () {
//     Route::post('/user/store', [UserController::class, 'store']);
// });
// Route::post('/item/store', [ItemController::class, 'store']);
