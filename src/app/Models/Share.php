<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Share extends Model
{
    use HasFactory;

    protected $table = "share";


    public function file(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(File::class, 'file_id');
    }

    protected $fillable = [
        'user_id',
        'file_id',
        'file_path',
        'download_code',
        'expiration_date',
    ];

    protected $hidden = [
        'user_id',
        'file_path',
        'id',
        'file_id',
        'created_at',
        'updated_at',
    ];
}
