<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logo 选择器 - App图标搜索器</title>
    <meta name="description" content="搜索超过200万个App Store应用图标，获取设计灵感">
    <meta name="keywords" content="logo hunter,App图标搜索器,图标下载,设计灵感">
    <link rel="shortcut icon" href="https://api.photo8.site/path/img/icon-64@3x.png" type="image/png">
    <link rel="stylesheet" href="css/styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="search-container">
            <h1><i class="fas fa-search"></i> Logo 选择器</h1>
            <p class="subtitle">搜索超过200万个App Store应用图标，获取设计灵感</p>
            <form method="GET" action="" id="searchForm">
                <div class="search-wrapper">
                    <div class="search-box">
                        <input type="text" name="term" id="searchInput" placeholder="输入APP名字..." value="<?php echo htmlspecialchars($searchTerm ?? ''); ?>">
                        <!-- 修改国家选择器部分 -->
                        <div class="country-selector">
                            <div class="selected-country" id="selectedCountry">
                                <img src="https://flagcdn.com/w40/<?php echo strtolower($country ?? 'cn'); ?>.png" alt="国家" id="countryFlag">
                                <span class="country-code" id="countryCode"><?php echo $country ?? 'CN'; ?></span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="country-dropdown" id="countryDropdown">
                                <!-- 移除国家搜索框 -->
                                <div class="country-list" id="countryList">
                                    <!-- 国家列表将通过JavaScript动态生成 -->
                                </div>
                            </div>
                            <input type="hidden" name="country" id="countryInput" value="<?php echo $country ?? 'CN'; ?>">
                        </div>
                        <button type="submit"><i class="fas fa-search"></i></button>
                    </div>
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
            function fetchAppData($term, $limit, $offset, $country = 'CN') {
                $url = "https://itunes.apple.com/search?term=" . urlencode($term) . "&country=" . $country . "&entity=software&limit=" . $limit . "&offset=" . $offset;
                

                $json = @file_get_contents($url);
                if ($json === false) {
                    return [];
                }
                
                $data = json_decode($json, true);
                
                return $data['results'] ?? [];
            }

            $searchTerm = isset($_GET['term']) ? trim($_GET['term']) : '';
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
            $country = isset($_GET['country']) ? trim($_GET['country']) : 'CN';

            if ($searchTerm) {
                $apps = fetchAppData($searchTerm, $limit, 0, $country);
                if (!empty($apps)) {
                    // 这里可能需要根据新API的返回数据结构调整
                    foreach ($apps as $app) {
                        // 检查新API返回的数据结构，确保下面的字段存在
                        // 如果字段名不同，需要相应调整
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
                        $iconUrl = $app['artworkUrl100'] ?? $app['icon_url'] ?? '';
                        $cachedImageUrl = $imageCache->getCacheUrl($iconUrl);
                        echo '<img src="' . htmlspecialchars($cachedImageUrl) . '" alt="' . htmlspecialchars($app['trackName'] ?? $app['name'] ?? '') . '" 
                              data-high-res="' . str_replace('100x100bb', '512x512bb', $cachedImageUrl) . '">';
                        echo '</div>';
                        echo '<h3 class="app-name">' . htmlspecialchars($app['trackName'] ?? $app['name'] ?? '') . '</h3>';
                        echo '<p class="app-developer">' . htmlspecialchars($app['artistName'] ?? $app['developer'] ?? '') . '</p>';
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
            <p>© 2025 Logo 素材 - App图标搜索器</p>
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