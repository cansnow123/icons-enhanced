<?php
class ImageCache {
    private $cacheDir;
    private $cacheDuration = 604800; // 7天缓存

    public function __construct() {
        $this->cacheDir = __DIR__ . '/images/';
        if (!file_exists($this->cacheDir)) {
            mkdir($this->cacheDir, 0777, true);
        }
    }

    public function getCachedImage($url) {
        $cacheFile = $this->cacheDir . md5($url);
        
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $this->cacheDuration)) {
            return file_get_contents($cacheFile);
        }

        $imageContent = file_get_contents($url);
        if ($imageContent !== false) {
            file_put_contents($cacheFile, $imageContent);
            return $imageContent;
        }
        
        return false;
    }

    public function getCacheUrl($url) {
        return 'cache/image.php?url=' . urlencode($url);
    }
}