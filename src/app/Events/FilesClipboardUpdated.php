<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FilesClipboardUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $userId;
    public string $message;
    public string $type;

    /**
     * @param int $userId
     * @param string $message
     * @param string $type
     */
    public function __construct(int $userId, string $message, string $type)
    {
        $this->userId = $userId;
        $this->message = $message;
        $this->type = $type;
    }


    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('updates.'.$this->userId),
        ];
    }

    public function broadcastAs() : string {
        return 'files.clipboard.updated';
    }
}
