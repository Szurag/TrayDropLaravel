<?php

use App\Http\Controllers\StatusController;

Route::get('/status', [StatusController::class, 'status']);
