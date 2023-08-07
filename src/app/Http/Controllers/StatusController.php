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

    public function disk() : array
    {
        $totalSpace = disk_total_space('/');
        $freeSpace = disk_free_space('/');
        $usedSpace = $totalSpace - $freeSpace;

        $totalSpaceGB = round($totalSpace / (1000 * 1000 * 1000), 2);
        $freeSpaceGB = round($freeSpace / (1000 * 1000 * 1000), 2);
        $usedSpaceGB = round($usedSpace / (1000 * 1000 * 1000), 2);

        return [
            'total_space_gb' => $totalSpaceGB,
            'free_space_gb' => $freeSpaceGB,
            'used_space_gb' => $usedSpaceGB,
        ];
    }
}
