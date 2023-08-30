<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Events\FilesClipboardUpdated;
use App\Helpers\HashCrypt;
use App\Models\Clipboard;
use App\Models\History;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;

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

        if ($request->input('order_by') === "desc") {
            $clipboards = Clipboard::where('user_id', Auth::id())->orderBy('id', 'desc')->paginate($request->input('per_page', 10));
        } else {
            $clipboards = Clipboard::where('user_id', Auth::id())->orderBy('id', 'asc')->paginate($request->input('per_page', 10));
        }

        $data = $clipboards->getCollection();

        foreach ($data as &$item) {
            $item->content = HashCrypt::decryptText($item->content, $request->input('password'));
        }

        $clipboards->setCollection($data);

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

        Redis::set("user_clipboard_change:" . Auth::id(), true);
        event(new FilesClipboardUpdated(Auth::id(), "clipboard"));

        return response()->json([
            'result' => $clipboard
        ]);
    }

    public function updates(Request $request) : JsonResponse
    {
        $timeout = 80;
        $startTime = time();
        while (time() - $startTime < $timeout) {

            $val = Redis::get("user_clipboard_change:" . Auth::id());

            if ($val) {
                Redis::set("user_clipboard_change:" . Auth::id(), false);
                return response()->json([
                    'message' => 'Update!'
                ]);
            }

            usleep(250000);
        }

        return response()->json([], 204);
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

        event(new FilesClipboardUpdated(Auth::id(), "clipboard"));
        Redis::set("user_clipboard_change:" . Auth::id(), true);

        return response()->json([
            'message' => 'Clipboard item deleted.'
        ]);

    }

    public function destroyAll(Request $request): JsonResponse
    {
        $clipboards = Clipboard::where('user_id', Auth::id())->get();

        foreach ($clipboards as $clipboard) {
            History::create([
                'itemId' => $clipboard->id,
                'item_type' => 'clip',
                'userId' => Auth::id(),
            ]);
        }

        Clipboard::where('user_id', Auth::id())->delete();
        event(new FilesClipboardUpdated(Auth::id(), "clipboard"));
        Redis::set("user_clipboard_change:" . Auth::id(), true);

        return response()->json([
            'message' => 'Clipboard items deleted.'
        ]);
    }

}
