<?php
require_once 'ImageCache.php';

$url = isset($_GET['url']) ? $_GET['url'] : '';
if (empty($url)) {
    header("HTTP/1.0 404 Not Found");
    exit;
}

$imageCache = new ImageCache();
$image = $imageCache->getCachedImage($url);

if ($image === false) {
    header("HTTP/1.0 404 Not Found");
    exit;
}

$extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
switch(strtolower($extension)) {
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    default:
        header('Content-Type: image/jpeg');
}

header('Cache-Control: public, max-age=31536000');
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000));

echo $image;