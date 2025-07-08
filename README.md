# App图标搜索器增强版

一个高效、现代的 App 图标搜索和下载工具，基于 iTunes Search API 开发。支持多种尺寸图标下载，具有响应式设计和用户友好的界面。

## 功能特点

- 实时搜索：支持即时搜索结果展示
- 多尺寸下载：支持 75px、100px、256px、512px 尺寸
- 图片预览：支持图标大图预览
- 响应式设计：完美适配移动端和桌面端
- 智能缓存：支持服务端和客户端双重缓存机制
- 用户友好：简洁的界面设计和流畅的交互体验

## 技术栈

### 前端
- HTML5 + CSS3
- 原生 JavaScript (ES6+)
- CSS Grid 和 Flexbox 布局
- Service Worker 离线缓存

### 后端
- PHP 7.4+
- iTunes Search API
- 文件系统缓存

### 服务器
- Apache/Nginx
- PHP-FPM
- 图片缓存系统

## 部署指南

### 环境要求
- PHP >= 7.4
- Apache/Nginx Web服务器
- 允许外部API访问
- PHP GD库（用于图片处理）
- 足够的磁盘空间用于缓存

### Apache 部署步骤

```
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/icons-enhanced
    
    <Directory /path/to/icons-enhanced>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    <FilesMatch "\.(jpg|jpeg|png|gif)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

### Nginx 部署步骤

```
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/icons-enhanced;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \.(jpg|jpeg|png|gif)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }
}
```
### 配置权限

```
chmod -R 755 .
chmod -R 777 cache/images
```

## 自定义开发指南
### 前端定制
1. 样式修改
- 主题颜色：修改 css/styles.css 中的 CSS 变量
- 布局调整：修改 Grid 和 Flexbox 相关样式
- 响应式断点：调整 media queries 中的尺寸
2. 交互优化
- 搜索逻辑：修改 js/scripts.js 中的防抖函数
- 动画效果：调整 transition 和 transform 相关属性
- 预览功能：自定义模态框行为
### 后端定制
1. 缓存策略
- 修改缓存时间：调整 ImageCache.php 中的 cacheDuration
- 自定义缓存目录：更改 cacheDir 配置
- 添加缓存清理机制
2. API 调整
- 修改搜索参数：调整 iTunes API 请求参数
- 添加错误处理：完善异常处理机制
- 扩展搜索源：添加其他图标源支持
### 性能优化
1. 图片优化
- 实现图片懒加载
- 添加图片压缩功能
- 使用 WebP 格式支持
2. 缓存优化
- 实现浏览器缓存
- 添加 CDN 支持
- 优化缓存策略
## 常见问题
1. 图片加载失败
- 检查服务器权限设置
- 验证缓存目录权限
- 确认外部API访问是否正常
2. 搜索响应慢
- 调整防抖时间
- 优化数据请求策略
- 检查服务器性能
3. 移动端适配问题
- 检查视口设置
- 调整响应式断点
- 优化触摸交互
## 维护建议
1. 定期维护
- 清理过期缓存
- 更新依赖版本
- 检查API可用性
2. 性能监控
- 监控服务器负载
- 跟踪API响应时间
- 分析用户使用数据
## 贡献指南
欢迎提交 Pull Request 或 Issue。在提交之前，请确保：

1. 代码符合现有风格
2. 添加必要的注释和文档
3. 测试所有功能正常
## 许可证
MIT License - 详见根目录 LICENSE 文件

## 作者
[Snowz]

## 更新日志
### v1.0.0 (2025-03-31)
- 初始版本发布
- 基础搜索功能
- 多尺寸下载支持
### v1.1.0 (计划中)
- 添加图片懒加载
- 优化搜索体验
- 改进缓存机制
### v1.1.1 (2024-05-20)
- 修复了图标卡片的淡入动画问题
- 添加了DOM变化监听，确保动态加载内容正确显示
- 移除了前端显示的API调试信息
- 优化了国家选择器的宽度，使界面更紧凑