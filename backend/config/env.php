<?php
declare(strict_types=1);

return [
    'db_host' => getenv('SKILLSWAP_DB_HOST') ?: '127.0.0.1',
    'db_port' => (int) (getenv('SKILLSWAP_DB_PORT') ?: 3306),
    'db_name' => getenv('SKILLSWAP_DB_NAME') ?: 'skillswap',
    'db_user' => getenv('SKILLSWAP_DB_USER') ?: 'root',
    'db_pass' => getenv('SKILLSWAP_DB_PASS') ?: '',
    // Comma-separated list of allowed CORS origins. Explicitly set this for production web clients; the localhost default is only a local development convenience.
    'allowed_origins' => getenv('SKILLSWAP_ALLOWED_ORIGINS') ?: 'http://localhost:8081',
    // Enable to log blocked Origin headers for CORS whitelist debugging. Leave disabled by default to avoid noisy server logs.
    'log_cors_mismatches' => filter_var(getenv('SKILLSWAP_LOG_CORS_MISMATCHES') ?: '0', FILTER_VALIDATE_BOOLEAN),
    'token_ttl_hours' => (int) (getenv('SKILLSWAP_TOKEN_TTL_HOURS') ?: 168),
    'password_reset_ttl_minutes' => (int) (getenv('SKILLSWAP_PASSWORD_RESET_TTL_MINUTES') ?: 30),
    'log_reset_tokens' => filter_var(getenv('SKILLSWAP_LOG_RESET_TOKENS') ?: '0', FILTER_VALIDATE_BOOLEAN),
    'upload_dir' => __DIR__ . '/../uploads',
    'base_upload_url' => getenv('SKILLSWAP_UPLOAD_BASE_URL') ?: '/skillswap/backend/uploads',
];

