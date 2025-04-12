document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('back-to-top');
    const modal = document.getElementById('imagePreview');
    const modalImg = document.getElementById('previewImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const searchInput = document.getElementById('searchInput');
    const iconGrid = document.getElementById('iconGrid');

    // 返回顶部按钮
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    };

    backToTop.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 图标预览模态框
    document.querySelectorAll('.icon-image img').forEach(img => {
        img.onclick = function() {
            modal.style.display = 'block';
            modalImg.src = this.getAttribute('data-high-res');
            modalImg.alt = this.alt;
        };
    });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // 搜索输入优化
    // 搜索防抖功能
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    document.addEventListener('DOMContentLoaded', function() {
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        
        // 防止表单自动提交
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput.value.trim()) {
                this.submit();
            }
        });
    
        // 输入防抖
        const debouncedSearch = debounce(function(value) {
            if (value.trim().length >= 2) {
                searchForm.submit();
            }
        }, 800);
    
        // 监听输入事件
        searchInput.addEventListener('input', function(e) {
            const value = e.target.value;
            debouncedSearch(value);
        });
    
        // 添加加载状态
        searchForm.addEventListener('submit', function() {
            const button = this.querySelector('button[type="submit"]');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            // 2秒后恢复按钮状态（如果请求完成会被新页面覆盖）
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-search"></i>';
                button.disabled = false;
            }, 2000);
        });
    });

    // 图标加载动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('.icon-card').forEach(card => {
        observer.observe(card);
    });
});