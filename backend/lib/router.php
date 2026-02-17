<?php
declare(strict_types=1);

final class Router
{
    /**
     * @var array<int, array{method: string, regex: string, handler: callable}>
     */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $regex = preg_replace_callback(
            '/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/',
            static fn(array $matches): string => '(?P<' . $matches[1] . '>[^/]+)',
            $pattern
        );
        $this->routes[] = [
            'method' => strtoupper($method),
            'regex' => '#^' . $regex . '$#',
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $path): void
    {
        $method = strtoupper($method);
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }
            if (!preg_match($route['regex'], $path, $matches)) {
                continue;
            }

            $params = [];
            foreach ($matches as $key => $value) {
                if (is_string($key)) {
                    $params[$key] = $value;
                }
            }

            try {
                $handler = $route['handler'];
                $handler($params);
                return;
            } catch (Throwable $error) {
                jsonResponse(500, false, null, 'Internal server error');
            }
        }

        jsonResponse(404, false, null, 'Route not found');
    }
}

