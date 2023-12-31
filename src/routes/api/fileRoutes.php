<?php

use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::group(['prefix' => 'files'], function () {
        Route::get('', [FileController::class, 'index']);
        Route::post('', [FileController::class, 'store']);
        Route::get('/{id}', [FileController::class, 'show'])->where('id', '[0-9]+');
        Route::get('/updates', [FileController::class, 'updates']);
        Route::get('/{id}/download', [FileController::class, 'download'])->where('id', '[0-9]+');;
        Route::get('/{id}/edit', [FileController::class, 'edit']);
        Route::delete('/all', [FileController::class, 'destroyAll']);
        Route::delete('/{id}', [FileController::class, 'destroy']);
    });
});
