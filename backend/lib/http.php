<?php
declare(strict_types=1);

function applyCorsHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, corsAllowedOrigins(), true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}

function corsAllowedOrigins(): array
{
    static $allowedOrigins = null;
    if ($allowedOrigins !== null) {
        return $allowedOrigins;
    }

    $env = require __DIR__ . '/../config/env.php';
    $rawOrigins = $env['allowed_origins'] ?? '';
    if (!is_string($rawOrigins) || trim($rawOrigins) === '') {
        $allowedOrigins = [];
        return $allowedOrigins;
    }

    $allowedOrigins = array_values(
        array_unique(
            array_filter(
                array_map('trim', explode(',', $rawOrigins)),
                static fn(string $value): bool => $value !== ''
            )
        )
    );

    return $allowedOrigins;
}

function jsonInput(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        jsonResponse(400, false, null, 'Invalid JSON body');
    }

    return $decoded;
}

function jsonResponse(int $statusCode, bool $success, mixed $data = null, ?string $error = null): never
{
    http_response_code($statusCode);
    applyCorsHeaders();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        [
            'success' => $success,
            'data' => $data,
            'error' => $error,
        ],
        JSON_UNESCAPED_SLASHES
    );
    exit;
}

function requireFields(array $input, array $fields): void
{
    foreach ($fields as $field) {
        if (!array_key_exists($field, $input) || $input[$field] === '' || $input[$field] === null) {
            jsonResponse(422, false, null, sprintf('Missing field: %s', $field));
        }
    }
}

function getBearerToken(): ?string
{
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($authHeader === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        if (is_array($headers)) {
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }
    }

    if (!preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        return null;
    }

    return trim($matches[1]);
}

function intQuery(string $key, int $default): int
{
    $value = $_GET[$key] ?? null;
    if ($value === null || $value === '') {
        return $default;
    }
    if (!is_numeric($value)) {
        return $default;
    }
    return (int) $value;
}

function strQuery(string $key, string $default = ''): string
{
    $value = $_GET[$key] ?? $default;
    if (!is_string($value)) {
        return $default;
    }
    return trim($value);
}

function routePath(): string
{
    if (isset($_GET['route']) && is_string($_GET['route'])) {
        return '/' . trim($_GET['route'], '/');
    }

    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if (!is_string($uri) || $uri === '') {
        return '/';
    }

    $apiPos = strpos($uri, '/api/');
    if ($apiPos !== false) {
        $uri = substr($uri, $apiPos + 4);
    } elseif (str_ends_with($uri, '/api') || str_ends_with($uri, '/api/')) {
        $uri = '/';
    }

    $normalized = '/' . trim($uri, '/');
    return preg_replace('#/+#', '/', $normalized) ?: '/';
}

