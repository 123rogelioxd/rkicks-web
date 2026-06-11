<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$slug = isset($_GET['slug']) ? (string) $_GET['slug'] : '';

if (!preg_match('/^[a-zA-Z0-9_-]+$/', $slug)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid product slug']);
    exit;
}

$url = 'https://api.rdecants.com/api/rkicks/products/' . rawurlencode($slug) . '?_=' . rawurlencode((string) time());
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Accept: application/json\r\nCache-Control: no-cache\r\n",
        'timeout' => 15,
        'ignore_errors' => true,
    ],
]);

$body = @file_get_contents($url, false, $context);
$status = 502;

if (isset($http_response_header) && is_array($http_response_header)) {
    foreach ($http_response_header as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d+)/', $header, $matches)) {
            $status = (int) $matches[1];
            break;
        }
    }
}

if ($body === false || $status < 200 || $status >= 300) {
    http_response_code($status >= 400 ? $status : 502);
    echo json_encode(['error' => 'RKicks product API unavailable']);
    exit;
}

http_response_code($status);
echo $body;
