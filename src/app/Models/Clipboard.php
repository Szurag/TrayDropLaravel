<?php declare(strict_types=1);

namespace App\Models;

use App\Enums\DeviceTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clipboard extends Model
{
    use HasFactory;

    protected $table = "clipboard";

    protected $fillable = [
        "content",
        "device_type",
        "user_id"
    ];

    protected $hidden = [
        "user_id"
    ];

    protected $casts = [
        'device_type' => DeviceTypeEnum::class
    ];
}
