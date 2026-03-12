# Skill Swap Architecture (Implemented Scaffold)

## High-Level
- Client: React Native app (`frontend/`)
- Server: PHP REST API on WAMP (`backend/`)
- Database: MySQL schema (`backend/sql/schema.sql`)

## API Modules
- Auth: register, login, forgot, reset-password, logout, me
- Profile: update, avatar upload, user profile
- Verification: upload document, admin review, pending (admin)
- Skills: list, teach add/update/delete, learn add, learn delete, teach mine, learn mine, teach search
- Availability: mine, upsert, delete
- Matching: recommended, by skill
- Swap Requests: create/respond/complete, inbox/sent
- Chat: start, conversations, send, messages, longpoll, mark-read
- Reviews: add, list by user
- Safety: block, report

## Security
- Passwords hashed with `password_hash` / `password_verify`
- Prepared statements via PDO
- Bearer token middleware with expiry
- Database-backed rate limiting on auth endpoints
- Upload MIME/size checks and randomized filenames
- Authorization checks on chat/swap/review actions

## Chat Strategy
- Implemented: polling (`/chat/messages?after_id=...`)
- Also available: long polling (`/chat/longpoll`)

