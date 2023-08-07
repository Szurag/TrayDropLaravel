<?php declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class StatusController extends Controller
{
    public function status() : JsonResponse {
        return response()->json([
            'status' => 'OK',
            'message' => 'API is working',
            'hello' => "I am TrayDrop API developed by Szurag. Special thanks to Onhq11.",
            'version' => '4.2.0'
        ]);
    }
}
