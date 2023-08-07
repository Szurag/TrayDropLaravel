<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\HashCrypt;
use App\Models\Clipboard;
use App\Models\History;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class ClipboardController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        if ($request->input('per_page') > 100) {
            return response()->json([
                'message' => 'The per_page parameter cannot be greater than 100.'
            ], 400);
        }

        $request->validate([
            'password' => 'required'
        ]);


        if (Hash::check(base64_decode($request->input('password')), Auth::user()->password ) === false) {
            return response()->json([
                'message' => 'Invalid password.'
            ], 400);
        }

        $clipboards = [];

        foreach (Clipboard::where('user_id', Auth::id())->get() as $clipboard) {
            $clipboard->content = HashCrypt::decryptText($clipboard->content, $request->input('password'));
            $clipboards[] = $clipboard;
        }

        if (count($clipboards) === 0) {
            return response()->json([], 204);
        }

        if ($request->input('order_by') === "desc") {
            $clipboards = array_reverse($clipboards);
        }

        return response()->json($clipboards);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content' => 'required',
            'device_type' => 'required',
            'password' => 'required'
        ]);

        if (Hash::check(base64_decode($request->input('password')), Auth::user()->password ) === false) {
            return response()->json([
                'message' => 'Invalid password.'
            ], 400);
        }

        $content = HashCrypt::encryptText($request->input('content'), $request->input('password'));

        $clipboard = Clipboard::create([
            'content' => $content,
            'device_type' => $request->input('device_type'),
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'result' => $clipboard
        ]);
    }

    public function updates(Request $request) : JsonResponse {
        $timeout = 90;
        $lastClipId = Clipboard::where('user_id', Auth::id())->max('id');
        $lastHistoryClipId = History::where('userId', Auth::id())->where('item_type', 'clip')->orderBy('created_at', 'desc')->first();

        if ($lastClipId === null)
            $lastClipId = 0;

        if ($lastHistoryClipId === null)
            $lastHistoryClipId = 0;
        else
            $lastHistoryClipId = $lastHistoryClipId->id;

        $startTime = time();
        while (time() - $startTime < $timeout) {
            $newClips = Clipboard::where('user_id', Auth::id())
                ->where('id', '>', $lastClipId)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get();

            if ($newClips->count() > 0) {
                return response()->json([
                    'newClips' => $newClips
                ]);
            }

            $deletedClips = History::where('userId', Auth::id())
                ->where('item_type', 'clip')
                ->where('id', '>', $lastHistoryClipId)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get();

            if ($deletedClips->count() > 0) {
                return response()->json([
                    'deletedClips' => $deletedClips
                ]);
            }

            usleep(500000); // 500ms
        }

        return response()->json([], 204);
    }

    public function show(string $id)
    {

    }

    public function destroy(string $id): JsonResponse
    {
        $clipboard = Clipboard::where('id', $id)->where('user_id', Auth::id())->first();

        if (! $clipboard) {
            return response()->json([
                'message' => 'Clipboard not found.'
            ], 404);
        }

        History::create([
            'itemId' => $clipboard->id,
            'item_type' => 'clip',
            'userId' => Auth::id(),
        ]);

        Clipboard::destroy($id);

        return response()->json([
            'message' => 'Clipboard item deleted.'
        ]);

    }

}
