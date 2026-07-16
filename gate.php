<?php
declare(strict_types=1);

const HUMAN_VERIFICATION_TTL = 1800;

function isHumanVerified(): bool
{
    if (($_SESSION['human_verified'] ?? false) !== true) {
        return false;
    }

    $verifiedAt = $_SESSION['human_verified_at'] ?? 0;
    return (time() - (int)$verifiedAt) <= HUMAN_VERIFICATION_TTL;
}

function markHumanVerified(): void
{
    $_SESSION['human_verified'] = true;
    $_SESSION['human_verified_at'] = time();
}
