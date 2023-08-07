<?php declare(strict_types=1);

use App\Http\Controllers\ClipboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::group(['prefix' => 'clipboard'], function () {
        Route::get('', [ClipboardController::class, 'index']);
        Route::post('', [ClipboardController::class, 'store']);
        Route::get('/updates', [ClipboardController::class, 'updates']);
        Route::get('/{id}', [ClipboardController::class, 'show']);
        Route::delete('/{id}', [ClipboardController::class, 'destroy']);
    });
});
