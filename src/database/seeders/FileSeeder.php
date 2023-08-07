<?php

namespace Database\Seeders;

use App\Models\File;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $uuid = Str::uuid()->toString();
            File::create([
                'original_name' => 'test.png',
                'filename' =>  $uuid . '-' . 'test.png',
                'path' => 'files/' . $uuid . '-' . 'test.png',
                'user_id' => 1
            ]);
        }
    }
}
