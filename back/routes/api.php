<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'index']);
    Route::get('/me/item', [MeController::class, 'items']);
    Route::patch('/me', [MeController::class, 'update']);
    Route::post('/me/get-item', [MeController::class, 'getItem']);
    Route::post('/me/get-weapon', [MeController::class, 'getWeapon']);
    Route::patch('/me/use-item', [MeController::class, 'useItem']);
    Route::get('/me/weapon', [MeController::class, 'weapon']);
    Route::patch('/me/change-weapon', [MeController::class, 'changeWeapon']);
});
