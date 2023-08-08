<?php

use App\Http\Controllers\FileController;

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::group(['prefix' => 'files'], function () {
        Route::get('', [FileController::class, 'index']);
        Route::post('', [FileController::class, 'store']);
        Route::get('/updates', [FileController::class, 'updates']);
        Route::post('/share', [FileController::class, 'share']);
        Route::get('/{id}', [FileController::class, 'show']);
        Route::get('/{id}/download', [FileController::class, 'download']);
        Route::get('/{id}/edit', [FileController::class, 'edit']);
        Route::delete('/all', [FileController::class, 'destroyAll']);
        Route::delete('/{id}', [FileController::class, 'destroy']);
    });
});

Route::group(['prefix' => 'files'], function () {
    Route::get('/share/{download_code}', [FileController::class, 'download_share']);
});
