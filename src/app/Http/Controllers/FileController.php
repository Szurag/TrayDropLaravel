<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\History;
use App\Models\Share;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * @param Request $request
     * @return Collection
     */

    public function index(Request $request) : JsonResponse {

        if ($request->input('per_page') > 100) {
            return response()->json([
                'message' => 'The per_page parameter cannot be greater than 100.'
            ], 400);
        }

        if ($request->input('order_by') === "desc") {
            $files = File::where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate($request->input('per_page', 10));
        } else {
            $files = File::where('user_id', Auth::id())->paginate($request->input('per_page', 10));
        }

        return response()->json($files);
    }

    public function store(Request $request) : JsonResponse {
        if (Auth::user()->encrypt_files) {
            $request->validate([
                'file' => 'required',
                'password' => 'required'
            ]);

            if (!Hash::check(base64_decode($request->input('password')), Auth::user()->password )) {
                return response()->json([
                    'message' => 'Invalid password.'
                ], 400);
            }

            $file = $request->file('file');
            $password = base64_decode($request->input('password'));

            // Initialization vector
            $ivSize = openssl_cipher_iv_length('aes-256-cbc');
            $iv = openssl_random_pseudo_bytes($ivSize);

            $uuid = Str::uuid()->toString();
            $filename = $file->getClientOriginalName();
            $encryptedFileName = $uuid . "-" . $filename;

            $fileContents = file_get_contents($file->path());
            $encryptedContents = openssl_encrypt($fileContents, 'aes-256-cbc', $password, OPENSSL_RAW_DATA, $iv);

            $encryptedDataWithIV = $iv . $encryptedContents;

            $storagePath = 'files/' . $encryptedFileName;
            Storage::put($storagePath, $encryptedDataWithIV);

            $file = File::create([
                'original_name' => $filename,
                'filename' => $encryptedFileName,
                'path' => $storagePath,
                'user_id' => Auth::id()
            ]);



        } else {
            $request->validate([
                'file' => 'required'
            ]);

            $file = $request->file('file');

            $uuid = Str::uuid()->toString();
            $filename = $file->getClientOriginalName();
            $fileNameOnServer = $uuid . "-" . $filename;

            $storagePath = 'files/' . $fileNameOnServer;
            Storage::put($storagePath, file_get_contents($file->path()));

            $file = File::create([
                'original_name' => $filename,
                'filename' => $fileNameOnServer,
                'path' => $storagePath,
                'user_id' => Auth::id()
            ]);
        }

        return response()->json([
            'message' => 'File uploaded successfully.',
            'file' => $file
        ], 201);
    }

    public function updates(Request $request) : JsonResponse {
        $timeout = 90;
        $lastFileId = File::where('user_id', Auth::id())->max('id');
        $lastHistoryFileId = History::where('userId', Auth::id())->where('item_type', 'file')->orderBy('created_at', 'desc')->first();

        if ($lastFileId === null)
            $lastFileId = 0;

        if ($lastHistoryFileId === null)
            $lastHistoryFileId = 0;
        else
            $lastHistoryFileId = $lastHistoryFileId->id;



        $startTime = time();
        while (time() - $startTime < $timeout) {
            $newFiles = File::where('user_id', Auth::id())
                ->where('id', '>', $lastFileId)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get();

            if ($newFiles->count() > 0) {
                return response()->json($newFiles);
            }

            $deletedFiles = History::where('userId', Auth::id())
                ->where('item_type', 'file')
                ->where('id', '>', $lastHistoryFileId)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get();

            if ($deletedFiles->count() > 0) {
                return response()->json([
                    'deletedFiles' => $deletedFiles
                ]);
            }

            usleep(500000); // 500ms
        }

        return response()->json([], 204);
    }

    public function show(int $id) : JsonResponse {

        $file = File::where('id', $id)->where('user_id', Auth::id())->first();

        if (! $file) {
            return response()->json([
                'message' => 'File not found.'
            ], 404);
        }

        return response()->json([
            'file' => $file
        ]);
    }

    public function download(Request $request, int $id): \Illuminate\Foundation\Application|\Illuminate\Http\Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory
    {
        // Nie wiem jaki tu response dać ( : )

        if (Auth::user()->encrypt_files) {

            $request->validate([
                'password' => 'required'
            ]);


            $password = base64_decode($request->input('password'));

            if (Hash::check($password, Auth::user()->password ) === false) {
                return response()->json([
                    'message' => 'Invalid password.'
                ], 400);
            }

            $file = File::where('id', $id)->where('user_id', Auth::id())->first();

            if (! $file) {
                return response()->json([
                    'message' => 'File not found.'
                ], 404);
            }

            $ivSize = 16;
            $iv = substr(Storage::get($file->path), 0, $ivSize);
            $encryptedContents = substr(Storage::get($file->path), $ivSize);

            $decryptedContents = openssl_decrypt($encryptedContents, 'aes-256-cbc', $password, OPENSSL_RAW_DATA, $iv);

        } else {
            $file = File::where('id', $id)->where('user_id', Auth::id())->first();

            if (! $file) {
                return response()->json([
                    'message' => 'File not found.'
                ], 404);
            }

            $decryptedContents = Storage::get($file->path);
        }

        $headers = [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $file->original_name . '"',
            'Access-Control-Expose-Headers' => 'Content-Disposition',
        ];

        return response($decryptedContents, 200, $headers);
    }

    public function edit(Request $request, string $id) : JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
        ]);

        $file = File::where('id', $id)->where('user_id', Auth::id())->first();

        if (! $file) {
            return response()->json([
                'message' => 'File not found.'
            ], 404);
        }


        $file->original_name = $validatedData['name'];
        $file->save();

        return response()->json([
            'message' => "Update successfully.",
            'file' => $file
        ]);
    }

    public function destroy(int $id) : JsonResponse {
        $file = File::where('id', $id)->where('user_id', Auth::id())->first();

        if (! $file) {
            return response()->json([
                'message' => 'File not found.'
            ], 404);
        }

        $share = Share::where('file_id', $id)->first();

        Storage::delete($share->file_path);
        Storage::delete($file->path);

        History::create([
            'itemId' => $file->id,
            'item_type' => 'file',
            'userId' => Auth::id(),
        ]);

        File::destroy($id);

        return response()->json([
            'message' => 'File deleted.'
        ]);
    }

    public function share(Request $request) : JsonResponse {

        $request->validate([
            'file_id' => 'required',
            'expiration_date' => 'required|date'
        ]);

        if (Auth::user()->encrypt_files) {

            $request->validate([
                'password' => 'required'
            ]);

            $password = base64_decode($request->input('password'));

            if (Hash::check($password, Auth::user()->password ) === false) {
                return response()->json([
                    'message' => 'Invalid password.'
                ], 400);
            }

            $file = File::where('id', $request->input('file_id'))->where('user_id', Auth::id())->first();

            if (! $file) {
                return response()->json([
                    'message' => 'File not found.'
                ], 404);
            }

            $ivSize = 16;
            $iv = substr(Storage::get($file->path), 0, $ivSize);
            $encryptedContents = substr(Storage::get($file->path), $ivSize);

            $decryptedContents = openssl_decrypt($encryptedContents, 'aes-256-cbc', $password, OPENSSL_RAW_DATA, $iv);

            $uuid = Str::uuid()->toString();

            $storagePath = 'files/' . $uuid;
            Storage::put($storagePath, $decryptedContents);

            $share = Share::where('user_id', Auth::id())->where('file_id', $request->input('file_id'))->first();

            if ($share !== null) {
                Storage::delete($share->file_path);
                $share->delete();
            }

            $share = Share::create([
                'user_id' => Auth::id(),
                'file_id' => $request->input('file_id'),
                'file_path' => $storagePath,
                'download_code' => Str::random(7),
                'expiration_date' => $request->input('expiration_date'),
            ]);

            return response()->json([
                'message' => 'File shared.',
                'share' => $share
            ]);

        } else {
            $file = File::where('id', $request->input('file_id'))->where('user_id', Auth::id())->first();

            if (! $file) {
                return response()->json([
                    'message' => 'File not found.'
                ], 404);
            }

            $share = Share::create([
                'user_id' => Auth::id(),
                'file_id' => $request->input('file_id'),
                'download_code' => Str::random(7),
                'expiration_date' => $request->input('expiration_date'),
            ]);

            return response()->json([
                'message' => 'File shared.',
                'share' => $share
            ]);
        }
    }

    public function download_share(string $download_code): \Illuminate\Foundation\Application|\Illuminate\Http\Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory
    {

        if (strlen($download_code) <= 0) {
            return response()->json([
                'message' => 'The download code field is required.',
                'errors' => [
                    'download_code' => [
                        'The download code field is required.'
                    ]
                ]
            ], 400);
        }



        $share = Share::where('download_code', $download_code)->first();

        if (! $share) {
            return response()->json([
                'message' => 'File not found.'
            ], 404);
        }

        $file = File::where('id', $share->file_id)->first();

        if ($share->expiration_date < Carbon::now()) {
            $share->delete();

            return response()->json([
                'message' => 'File expired.'
            ], 400);
        }



        $headers = [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . $file->original_name . '"',
            'Access-Control-Expose-Headers' => 'Content-Disposition',
        ];

        return response(Storage::get($share->file_path), 200, $headers);
    }
}
