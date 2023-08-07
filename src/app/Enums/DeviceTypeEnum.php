<?php declare(strict_types=1);

namespace App\Enums;

enum DeviceTypeEnum: string {
    case DESKTOP = "desktop";
    case MOBILE = "mobile";
    case WEB = "web";
}
