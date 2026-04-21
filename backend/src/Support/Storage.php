<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class Storage
{
    private string $uploadPath;
    private string $publicPath;

    public function __construct(string $rootPath)
    {
        $this->uploadPath = $_ENV['UPLOAD_PATH'] ?? ($rootPath . '/public/uploads');
        $this->publicPath = '/uploads';

        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }

    public function save(array $file): string
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new ApiException('File upload failed with error code ' . $file['error'], 400);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'xlsx', 'csv', 'xls'];

        if (!in_array(strtolower($extension), $allowedExtensions)) {
            throw new ApiException('Invalid file type. Allowed: ' . implode(', ', $allowedExtensions), 400);
        }

        // Limit to 25MB
        if ($file['size'] > 25 * 1024 * 1024) {
            throw new ApiException('File size exceeds the 25MB limit.', 400);
        }

        $filename = bin2hex(random_bytes(16)) . '.' . $extension;
        $destination = $this->uploadPath . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new ApiException('Failed to move uploaded file.', 500);
        }

        return $this->publicPath . '/' . $filename;
    }

    public function delete(string $publicUrl): void
    {
        if (str_starts_with($publicUrl, $this->publicPath)) {
            $filename = str_replace($this->publicPath . '/', '', $publicUrl);
            $path = $this->uploadPath . '/' . $filename;
            if (is_file($path)) {
                unlink($path);
            }
        }
    }
}
