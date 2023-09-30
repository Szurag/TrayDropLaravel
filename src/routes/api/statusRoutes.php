<?php

use App\Http\Controllers\StatusController;
use Illuminate\Support\Facades\Route;

Route::get('/status', [StatusController::class, 'status']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/disk', [StatusController::class, 'disk']);
});
