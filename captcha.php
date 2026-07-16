<?php
declare(strict_types=1);

session_start();

function generateCaptchaCode(int $length = 6): string
{
    $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return $code;
}

$code = generateCaptchaCode();
$_SESSION['captcha_code'] = $code;
$_SESSION['captcha_generated_at'] = time();

$width = 160;
$height = 60;
$image = imagecreatetruecolor($width, $height);

$bgColor = imagecolorallocate($image, 20, 90, 60);
imagefill($image, 0, 0, $bgColor);

for ($i = 0; $i < 6; $i++) {
    $lineColor = imagecolorallocate($image, random_int(10, 60), random_int(80, 140), random_int(60, 110));
    imageline($image, random_int(0, $width), random_int(0, $height), random_int(0, $width), random_int(0, $height), $lineColor);
}

$textColor = imagecolorallocate($image, 255, 255, 255);
$fontSize = 5;
$charSpacing = (int)($width / (strlen($code) + 1));
for ($i = 0, $len = strlen($code); $i < $len; $i++) {
    $x = $charSpacing * ($i + 1) - 6;
    $y = (int)($height / 2) - 8 + random_int(-4, 4);
    imagestring($image, $fontSize, $x, $y, $code[$i], $textColor);
}

for ($i = 0; $i < 80; $i++) {
    $dotColor = imagecolorallocate($image, random_int(150, 255), random_int(150, 255), random_int(150, 255));
    imagesetpixel($image, random_int(0, $width - 1), random_int(0, $height - 1), $dotColor);
}

header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate');
imagepng($image);
imagedestroy($image);
