# Skill Swap Backend (PHP + MySQL)

This folder contains a REST API scaffold for the Skill Swap platform.

## Stack
- PHP 8.x (WAMP Apache)
- MySQL 8.x
- PDO with prepared statements
- Token-based auth via `auth_tokens`

## Setup
1. Create database and tables:
   - Import `sql/schema.sql` in phpMyAdmin.
2. Put this backend under WAMP:
   - Example: `C:\wamp64\www\skillswap\backend`
3. Configure DB via environment variables (optional):
   - `SKILLSWAP_DB_HOST` (default `127.0.0.1`)
   - `SKILLSWAP_DB_PORT` (default `3306`)
   - `SKILLSWAP_DB_NAME` (default `skillswap`)
   - `SKILLSWAP_DB_USER` (default `root`)
   - `SKILLSWAP_DB_PASS` (default empty)
   - `SKILLSWAP_TOKEN_TTL_HOURS` (default `168`)
4. API base URL:
   - `http://localhost/skillswap/backend/api/index.php`
5. Health check:
   - `GET /health`

## Auth Header
Use bearer token:

`Authorization: Bearer <token>`

## Response Shape
All endpoints return:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

