<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;

Route::post('/auth/user-login', [AuthController::class, 'userLogin']);
Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);

Route::middleware('admin')->group(function () {
    Route::post('/user', [UserController::class, 'store']);
    Route::post('/item', [ItemController::class, 'store']);
});
