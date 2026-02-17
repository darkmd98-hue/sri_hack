<?php
declare(strict_types=1);

final class UploadService
{
    /**
     * @param array<string, string> $allowedMimeMap mime => extension
     */
    public static function storeUploadedFile(
        array $file,
        array $allowedMimeMap,
        int $maxBytes,
        string $baseUploadDir,
        string $subDir
    ): string {
        if (!isset($file['tmp_name'], $file['name'], $file['error'], $file['size'])) {
            jsonResponse(400, false, null, 'Invalid upload payload');
        }
        if ((int) $file['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(400, false, null, 'File upload failed');
        }
        if ((int) $file['size'] > $maxBytes) {
            jsonResponse(413, false, null, 'File too large');
        }
        if (!is_uploaded_file((string) $file['tmp_name'])) {
            jsonResponse(400, false, null, 'Invalid uploaded file');
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = $finfo ? finfo_file($finfo, (string) $file['tmp_name']) : false;
        if ($finfo) {
            finfo_close($finfo);
        }

        if (!is_string($mime) || !isset($allowedMimeMap[$mime])) {
            jsonResponse(415, false, null, 'Unsupported file type');
        }

        $targetDir = rtrim($baseUploadDir, '/\\') . DIRECTORY_SEPARATOR . trim($subDir, '/\\');
        if (!is_dir($targetDir) && !mkdir($targetDir, 0775, true) && !is_dir($targetDir)) {
            jsonResponse(500, false, null, 'Failed to prepare upload directory');
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $allowedMimeMap[$mime];
        $destination = $targetDir . DIRECTORY_SEPARATOR . $filename;
        if (!move_uploaded_file((string) $file['tmp_name'], $destination)) {
            jsonResponse(500, false, null, 'Failed to save uploaded file');
        }

        return trim($subDir, '/\\') . '/' . $filename;
    }
}

