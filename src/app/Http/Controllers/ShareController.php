<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Share;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ShareController extends Controller
{
    public function index(Request $request) : JsonResponse {

        // TODO: Tego typu to sie powtarza trzeba ogarnąć jakieś middleware może?
        if ($request->input('per_page') > 100) {
            return response()->json([
                'message' => 'The per_page parameter cannot be greater than 100.'
            ], 400);
        }

        if ($request->input('order_by') === "desc") {
            $shares = Share::with('file')->where('user_id', Auth::id())->orderBy('id', 'desc')->paginate($request->input('per_page', 10));
        } else {
            $shares = Share::with('file')->where('user_id', Auth::id())->paginate($request->input('per_page', 10));
        }

        return response()->json($shares);
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

            if ($share) {
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

            $share = Share::where('user_id', Auth::id())->where('file_id', $request->input('file_id'))->first();

            if ($share) {
                $share->delete();
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

    public function destroy(int $file_id): JsonResponse
    {
        $share = Share::where('file_id', $file_id)->where('user_id', Auth::id())->first();

        if (! $share) {
            return response()->json([
                'message' => 'Share not found.'
            ], 404);
        }

        if ($share->file_path !== null) {
            Storage::delete($share->file_path);
        }
        $share->delete();

        return response()->json([
            'message' => 'Share deleted.'
        ]);
    }
}
