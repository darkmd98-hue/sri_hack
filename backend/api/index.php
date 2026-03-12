<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../lib/http.php';
require_once __DIR__ . '/../lib/rate_limit.php';
require_once __DIR__ . '/../lib/router.php';
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../services/TokenService.php';
require_once __DIR__ . '/../services/UploadService.php';
require_once __DIR__ . '/../services/MatchingService.php';
require_once __DIR__ . '/../services/ChatService.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ProfileController.php';
require_once __DIR__ . '/../controllers/SkillController.php';
require_once __DIR__ . '/../controllers/AvailabilityController.php';
require_once __DIR__ . '/../controllers/MatchController.php';
require_once __DIR__ . '/../controllers/SwapController.php';
require_once __DIR__ . '/../controllers/ChatController.php';
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../controllers/SafetyController.php';

applyCorsHeaders();
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$pdo = getPdo();
$router = new Router();

$router->add('GET', '/health', static function (): void {
    jsonResponse(200, true, ['service' => 'skillswap-api', 'status' => 'ok']);
});

$router->add('POST', '/auth/register', static function () use ($pdo): void {
    AuthController::register($pdo);
});
$router->add('POST', '/auth/login', static function () use ($pdo): void {
    AuthController::login($pdo);
});
$router->add('POST', '/auth/forgot', static function () use ($pdo): void {
    AuthController::forgot($pdo);
});
$router->add('POST', '/auth/reset-password', static function () use ($pdo): void {
    AuthController::resetPassword($pdo);
});
$router->add('POST', '/auth/logout', static function () use ($pdo): void {
    AuthController::logout($pdo);
});
$router->add('GET', '/me', static function () use ($pdo): void {
    AuthController::me($pdo);
});

$router->add('POST', '/profile/update', static function () use ($pdo): void {
    ProfileController::update($pdo);
});
$router->add('POST', '/profile/upload-avatar', static function () use ($pdo): void {
    ProfileController::uploadAvatar($pdo);
});
$router->add('POST', '/verification/upload-doc', static function () use ($pdo): void {
    ProfileController::uploadVerificationDoc($pdo);
});
$router->add('POST', '/verification/review', static function () use ($pdo): void {
    ProfileController::reviewVerificationDoc($pdo);
});
$router->add('GET', '/verification/pending', static function () use ($pdo): void {
    ProfileController::pendingVerificationDocs($pdo);
});
$router->add('GET', '/user/{id}', static function (array $params) use ($pdo): void {
    ProfileController::getUser($pdo, (int) $params['id']);
});

$router->add('GET', '/skills/list', static function () use ($pdo): void {
    SkillController::list($pdo);
});
$router->add('POST', '/teach/add', static function () use ($pdo): void {
    SkillController::addTeach($pdo);
});
$router->add('POST', '/teach/update', static function () use ($pdo): void {
    SkillController::updateTeach($pdo);
});
$router->add('POST', '/teach/delete', static function () use ($pdo): void {
    SkillController::deleteTeach($pdo);
});
$router->add('POST', '/learn/add', static function () use ($pdo): void {
    SkillController::addLearn($pdo);
});
$router->add('POST', '/learn/delete', static function () use ($pdo): void {
    SkillController::deleteLearn($pdo);
});
$router->add('GET', '/teach/mine', static function () use ($pdo): void {
    SkillController::myTeach($pdo);
});
$router->add('GET', '/learn/mine', static function () use ($pdo): void {
    SkillController::myLearn($pdo);
});
$router->add('GET', '/teach/search', static function () use ($pdo): void {
    SkillController::searchTeach($pdo);
});

$router->add('GET', '/availability/mine', static function () use ($pdo): void {
    AvailabilityController::mine($pdo);
});
$router->add('POST', '/availability/upsert', static function () use ($pdo): void {
    AvailabilityController::upsert($pdo);
});
$router->add('POST', '/availability/delete', static function () use ($pdo): void {
    AvailabilityController::delete($pdo);
});

$router->add('GET', '/match/recommended', static function () use ($pdo): void {
    MatchController::recommended($pdo);
});
$router->add('GET', '/match/by-skill', static function () use ($pdo): void {
    MatchController::bySkill($pdo);
});

$router->add('POST', '/swap/request', static function () use ($pdo): void {
    SwapController::create($pdo);
});
$router->add('POST', '/swap/respond', static function () use ($pdo): void {
    SwapController::respond($pdo);
});
$router->add('POST', '/swap/complete', static function () use ($pdo): void {
    SwapController::complete($pdo);
});
$router->add('GET', '/swap/inbox', static function () use ($pdo): void {
    SwapController::inbox($pdo);
});
$router->add('GET', '/swap/sent', static function () use ($pdo): void {
    SwapController::sent($pdo);
});

$router->add('POST', '/chat/start', static function () use ($pdo): void {
    ChatController::start($pdo);
});
$router->add('GET', '/chat/conversations', static function () use ($pdo): void {
    ChatController::listConversations($pdo);
});
$router->add('GET', '/chat/messages', static function () use ($pdo): void {
    ChatController::messages($pdo);
});
$router->add('GET', '/chat/longpoll', static function () use ($pdo): void {
    ChatController::longPoll($pdo);
});
$router->add('POST', '/chat/send', static function () use ($pdo): void {
    ChatController::send($pdo);
});
$router->add('POST', '/chat/mark-read', static function () use ($pdo): void {
    ChatController::markRead($pdo);
});

$router->add('POST', '/review/add', static function () use ($pdo): void {
    ReviewController::add($pdo);
});
$router->add('GET', '/review/user/{id}', static function (array $params) use ($pdo): void {
    ReviewController::listByUser($pdo, (int) $params['id']);
});

$router->add('POST', '/block', static function () use ($pdo): void {
    SafetyController::block($pdo);
});
$router->add('POST', '/report', static function () use ($pdo): void {
    SafetyController::report($pdo);
});

$router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', routePath());

