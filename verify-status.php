<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/gate.php';

http_response_code(isHumanVerified() ? 200 : 403);
