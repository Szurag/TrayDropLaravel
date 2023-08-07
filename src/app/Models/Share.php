<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Share extends Model
{
    use HasFactory;

    protected $table = "share";

    protected $fillable = [
        'user_id',
        'file_id',
        'download_code',
        'expiration_date',
    ];

    protected $hidden = [
        'user_id'
    ];
}
