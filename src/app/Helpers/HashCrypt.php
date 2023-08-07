<?php

namespace App\Helpers;

class HashCrypt {
    static function encryptText(string $text, string $password): string {
        $ivSize = openssl_cipher_iv_length('AES-256-CBC');
        $iv = openssl_random_pseudo_bytes($ivSize);
        $encrypted = openssl_encrypt($text, 'AES-256-CBC', $password, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv . $encrypted);
    }

    static function decryptText(string $encryptedData, string $password): string {
        $decodedData = base64_decode($encryptedData);
        $ivSize = openssl_cipher_iv_length('AES-256-CBC');
        $iv = substr($decodedData, 0, $ivSize);

        $encryptedText = substr($decodedData, $ivSize);
        return openssl_decrypt($encryptedText, 'AES-256-CBC', $password, OPENSSL_RAW_DATA, $iv);
    }
}
