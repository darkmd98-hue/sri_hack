<?php
declare(strict_types=1);

return [
    'db_host' => getenv('SKILLSWAP_DB_HOST') ?: '127.0.0.1',
    'db_port' => (int) (getenv('SKILLSWAP_DB_PORT') ?: 3306),
    'db_name' => getenv('SKILLSWAP_DB_NAME') ?: 'skillswap',
    'db_user' => getenv('SKILLSWAP_DB_USER') ?: 'root',
    'db_pass' => getenv('SKILLSWAP_DB_PASS') ?: '',
    'token_ttl_hours' => (int) (getenv('SKILLSWAP_TOKEN_TTL_HOURS') ?: 168),
    'password_reset_ttl_minutes' => (int) (getenv('SKILLSWAP_PASSWORD_RESET_TTL_MINUTES') ?: 30),
    'log_reset_tokens' => filter_var(getenv('SKILLSWAP_LOG_RESET_TOKENS') ?: '1', FILTER_VALIDATE_BOOLEAN),
    'upload_dir' => __DIR__ . '/../uploads',
    'base_upload_url' => getenv('SKILLSWAP_UPLOAD_BASE_URL') ?: '/skillswap/backend/uploads',
];

