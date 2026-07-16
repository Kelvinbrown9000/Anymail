<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/gate.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}

$captchaInput = trim((string)($_POST['captcha'] ?? ''));
$expectedCaptcha = $_SESSION['captcha_code'] ?? null;
unset($_SESSION['captcha_code']);

if ($expectedCaptcha === null || $captchaInput === '' || strcasecmp($captchaInput, $expectedCaptcha) !== 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => "That code didn't match."]);
    exit;
}

markHumanVerified();
echo json_encode(['ok' => true]);
