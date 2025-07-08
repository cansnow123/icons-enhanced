document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('back-to-top');
    const modal = document.getElementById('imagePreview');
    const modalImg = document.getElementById('previewImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const searchInput = document.getElementById('searchInput');
    const iconGrid = document.getElementById('iconGrid');
    const countrySelector = document.querySelector('.country-selector');
    const selectedCountry = document.getElementById('selectedCountry');
    const countryDropdown = document.getElementById('countryDropdown');
    const countryList = document.getElementById('countryList');
    const countryInput = document.getElementById('countryInput');
    const countryFlag = document.getElementById('countryFlag');
    const countryCode = document.getElementById('countryCode');

    // 国家数据
    const countries = [
        { code: 'US', name: '美国' },
        { code: 'CN', name: '中国' },
        { code: 'JP', name: '日本' },
        { code: 'GB', name: '英国' },
        { code: 'DE', name: '德国' },
        { code: 'FR', name: '法国' },
        { code: 'IT', name: '意大利' },
        { code: 'ES', name: '西班牙' },
        { code: 'CA', name: '加拿大' },
        { code: 'AU', name: '澳大利亚' },
        { code: 'KR', name: '韩国' },
        { code: 'RU', name: '俄罗斯' },
        { code: 'BR', name: '巴西' },
        { code: 'IN', name: '印度' },
        { code: 'MX', name: '墨西哥' },
        { code: 'NL', name: '荷兰' },
        { code: 'SE', name: '瑞典' },
        { code: 'CH', name: '瑞士' },
        { code: 'SG', name: '新加坡' },
        { code: 'HK', name: '中国香港' },
        { code: 'TW', name: '中国台湾' },
    ];

    // 初始化国家列表
    function initCountryList() {
        countryList.innerHTML = '';
        countries.forEach(country => {
            const countryItem = document.createElement('div');
            countryItem.className = 'country-item';
            countryItem.innerHTML = `
                <img src="https://flagcdn.com/w40/${country.code.toLowerCase()}.png" alt="${country.name}">
                <span class="country-item-name">${country.name}</span>
                <span class="country-item-code">${country.code}</span>
            `;
            countryItem.addEventListener('click', () => {
                selectCountry(country.code, country.name);
            });
            countryList.appendChild(countryItem);
        });
    }

    // 选择国家
    function selectCountry(code, name) {
        countryInput.value = code;
        countryFlag.src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
        countryFlag.alt = name;
        countryCode.textContent = code;
        
        // 关闭下拉框
        closeDropdown();
    }

    // 打开下拉框
    function openDropdown() {
        countrySelector.classList.add('active');
        countryDropdown.classList.add('show');
    }

    // 关闭下拉框
    function closeDropdown() {
        countrySelector.classList.remove('active');
        countryDropdown.classList.remove('show');
    }

    // 初始化国家选择器
    initCountryList();

    // 从URL参数中获取当前选中的国家并设置
    function setCountryFromUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const countryParam = urlParams.get('country');
        
        if (countryParam) {
            const country = countries.find(c => c.code === countryParam);
            if (country) {
                selectCountry(country.code, country.name);
            }
        }
    }
    
    // 页面加载时设置国家
    setCountryFromUrlParams();

    // 国家选择器点击事件
    selectedCountry.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = countryDropdown.classList.contains('show');
        
        if (isVisible) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!countrySelector.contains(e.target)) {
            closeDropdown();
        }
    });

    // 返回顶部按钮
    let isScrolling = false;
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            if (!isScrolling) {
                backToTop.style.display = 'flex';
                setTimeout(() => {
                    backToTop.style.opacity = '1';
                    backToTop.style.transform = 'translateY(0)';
                }, 10);
            }
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(10px)';
            setTimeout(() => {
                backToTop.style.display = 'none';
            }, 300);
        }
    };

    backToTop.onclick = function() {
        isScrolling = true;
        backToTop.style.transform = 'translateY(-10px)';
        backToTop.style.opacity = '0';
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            backToTop.style.display = 'none';
            isScrolling = false;
        }, 300);
    };

    // 图标预览模态框
    document.querySelectorAll('.icon-image img').forEach(img => {
        img.onclick = function() {
            modal.style.display = 'block';
            modalImg.src = this.getAttribute('data-high-res');
            modalImg.alt = this.alt;
            
            // 添加打开动画
            setTimeout(() => {
                modal.style.opacity = '1';
                modalImg.style.transform = 'scale(1)';
            }, 10);
        };
    });

    closeBtn.onclick = function() {
        // 添加关闭动画
        modal.style.opacity = '0';
        modalImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.style.display = 'none';
            modalImg.style.transform = '';
        }, 300);
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            // 添加关闭动画
            modal.style.opacity = '0';
            modalImg.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modal.style.display = 'none';
                modalImg.style.transform = '';
            }, 300);
        }
    };

    // 搜索输入优化
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const searchForm = document.getElementById('searchForm');
    
    // 防止表单自动提交
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (searchInput.value.trim()) {
            const button = this.querySelector('button[type="submit"]');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            // 添加加载动画
            iconGrid.style.opacity = '0.6';
            iconGrid.style.pointerEvents = 'none';
            
            this.submit();
        }
    });

    // 输入防抖
    const debouncedSearch = debounce(function(value) {
        if (value.trim().length >= 2) {
            const button = searchForm.querySelector('button[type="submit"]');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            // 添加加载动画
            iconGrid.style.opacity = '0.6';
            iconGrid.style.pointerEvents = 'none';
            
            searchForm.submit();
        }
    }, 800);

    // 监听输入事件
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value;
        debouncedSearch(value);
    });

    // 图标加载动画
    function initIconCards() {
        const cards = document.querySelectorAll('.icon-card');
        cards.forEach((card, index) => {
            // 设置初始状态
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // 添加延迟动画
            setTimeout(() => {
                card.classList.add('fade-in');
                card.style.opacity = '';
                card.style.transform = '';
            }, index * 100);
        });
    }
    
    // 初始化图标卡片
    initIconCards();
    
    // 添加MutationObserver监听DOM变化
    const iconGridObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                requestAnimationFrame(() => {
                    initIconCards();
                });
            }
        });
    });
    
    // 开始观察图标网格的变化
    if (iconGrid) {
        iconGridObserver.observe(iconGrid, { childList: true, subtree: true });
    }
});