<?php
declare(strict_types=1);

return [
    'db_host' => getenv('SKILLSWAP_DB_HOST') ?: '127.0.0.1',
    'db_port' => (int) (getenv('SKILLSWAP_DB_PORT') ?: 3306),
    'db_name' => getenv('SKILLSWAP_DB_NAME') ?: 'skillswap',
    'db_user' => getenv('SKILLSWAP_DB_USER') ?: 'root',
    'db_pass' => getenv('SKILLSWAP_DB_PASS') ?: '',
    'token_ttl_hours' => (int) (getenv('SKILLSWAP_TOKEN_TTL_HOURS') ?: 168),
    'upload_dir' => __DIR__ . '/../uploads',
    'base_upload_url' => getenv('SKILLSWAP_UPLOAD_BASE_URL') ?: '/skillswap/backend/uploads',
];

