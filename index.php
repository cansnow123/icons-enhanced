<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App图标搜索器 - 增强版</title>
    <meta name="description" content="一款可以在线搜索APP图标并下载小工具">
    <meta name="keywords" content="photo8,App图标搜索器">
    <link rel="shortcut icon" href="https://api.photo8.site/path/img/icon-64@3x.png" type="image/png">
    <link rel="stylesheet" href="css/styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="search-container">
            <h1><i class="fas fa-search"></i> App图标搜索器</h1>
            <form method="GET" action="" id="searchForm">
                <div class="search-box">
                    <input type="text" name="term" id="searchInput" placeholder="输入APP名字..." value="<?php echo htmlspecialchars($searchTerm ?? ''); ?>">
                    <button type="submit"><i class="fas fa-search"></i></button>
                </div>
                <div class="search-options">
                    <select name="limit" id="limitSelect">
                        <option value="20">20个结果</option>
                        <option value="50">50个结果</option>
                        <option value="100">100个结果</option>
                    </select>
                </div>
            </form>
        </div>

        <div class="icon-grid" id="iconGrid">
            <?php
            function fetchAppData($term, $limit, $offset) {
                $url = "https://itunes.apple.com/search?term=" . urlencode($term) . "&country=CN&entity=software&limit=" . $limit . "&offset=" . $offset;
                $json = @file_get_contents($url);
                if ($json === false) {
                    return [];
                }
                $data = json_decode($json, true);
                return $data['results'] ?? [];
            }

            $searchTerm = isset($_GET['term']) ? trim($_GET['term']) : '';
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

            if ($searchTerm) {
                $apps = fetchAppData($searchTerm, $limit, 0);
                if (!empty($apps)) {
                    foreach ($apps as $app) {
                        $iconSizes = [
                            ['size' => '75x75bb', 'label' => '75px', 'desc' => '小图'],
                            ['size' => '100x100bb', 'label' => '100px', 'desc' => '标准'],
                            ['size' => '256x256bb', 'label' => '256px', 'desc' => '高清'],
                            ['size' => '512x512bb', 'label' => '512px', 'desc' => '超清']
                        ];
                        
                        echo '<div class="icon-card">';
                        require_once 'cache/ImageCache.php';
                        $imageCache = new ImageCache();
                        
                        // 启用图片缓存
                        echo '<div class="icon-image">';
                        $cachedImageUrl = $imageCache->getCacheUrl($app['artworkUrl100']);
                        echo '<img src="' . htmlspecialchars($cachedImageUrl) . '" alt="' . htmlspecialchars($app['trackName']) . '" 
                              data-high-res="' . str_replace('100x100bb', '512x512bb', $cachedImageUrl) . '">';
                        echo '</div>';
                        echo '<h3 class="app-name">' . htmlspecialchars($app['trackName']) . '</h3>';
                        echo '<div class="download-options">';
                        echo '<div class="download-options-row">';
                        // 前三个按钮 (75px, 100px, 256px)
                        foreach (array_slice($iconSizes, 0, 3) as $size) {
                            $sizeUrl = str_replace('100x100bb', $size['size'], $app['artworkUrl100']);
                            echo '<a href="' . htmlspecialchars($sizeUrl) . '" class="size-btn size-btn-small" target="_blank">';
                            echo '<span class="size-label">' . $size['label'] . '</span>';
                            echo '<span class="size-desc">' . $size['desc'] . '</span>';
                            echo '</a>';
                        }
                        echo '</div>';
                        // 最后一个按钮 (512px)
                        $lastSize = end($iconSizes);
                        $lastSizeUrl = str_replace('100x100bb', $lastSize['size'], $app['artworkUrl100']);
                        echo '<a href="' . htmlspecialchars($lastSizeUrl) . '" class="size-btn size-btn-large" target="_blank">';
                        echo '<span class="size-label">' . $lastSize['label'] . '</span>';
                        echo '<span class="size-desc">' . $lastSize['desc'] . '</span>';
                        echo '</a>';
                        echo '</div>';
                        echo '</div>';
                    }
                } else {
                    echo '<div class="no-results"><i class="fas fa-exclamation-circle"></i><p>没有找到相关应用</p></div>';
                }
            }
            ?>
        </div>
    </div>

    <div id="imagePreview" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="previewImage">
        <div id="imageCaption"></div>
    </div>

    <?php if ($searchTerm): ?>
    <footer>
        <div class="footer-content">
            <p>© 2024 PHOTO8 - App图标搜索器</p>
            <div class="social-links">
                <a href="#" title="微博"><i class="fab fa-weibo"></i></a>
                <a href="#" title="微信"><i class="fab fa-weixin"></i></a>
            </div>
        </div>
    </footer>
    <?php endif; ?>

    <button id="back-to-top" title="返回顶部"><i class="fas fa-arrow-up"></i></button>
    <script src="js/scripts.js"></script>
</body>
</html>