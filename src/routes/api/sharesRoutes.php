<?php

use App\Http\Controllers\ShareController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'share'], function () {
    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::get('/', [ShareController::class, 'index']);
        Route::post('/', [ShareController::class, 'share']);
        Route::delete('/{file_id}', [ShareController::class, 'destroy']);
    });

    Route::get('/{download_code}', [ShareController::class, 'download_share']);
});
