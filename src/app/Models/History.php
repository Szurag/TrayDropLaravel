<?php

namespace App\Models;

use App\Enums\ItemTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;

    protected $table = "history";

    protected $hidden = [
        "user_id"
    ];

    protected $fillable = [
        'itemId',
        'item_type',
        'userId',
    ];

    protected $casts = [
        'item_type' => ItemTypeEnum::class
    ];
}
