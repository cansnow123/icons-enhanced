document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('back-to-top');
    const modal = document.getElementById('imagePreview');
    const modalImg = document.getElementById('previewImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const searchInput = document.getElementById('searchInput');
    const iconGrid = document.getElementById('iconGrid');
    const selectedCountry = document.getElementById('selectedCountry');
    const countryDropdown = document.getElementById('countryDropdown');
    const countryList = document.getElementById('countryList');
    const countrySearchInput = document.getElementById('countrySearchInput');
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
        { code: 'HK', name: '香港' },
        { code: 'TW', name: '台湾' },
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
        countryDropdown.style.display = 'none';
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
        if (countryDropdown.style.display === 'block') {
            countryDropdown.style.display = 'none';
        } else {
            countryDropdown.style.display = 'block';
        }
    });

    // 移除国家搜索功能
    // countrySearchInput.addEventListener('input', function() {...});

    // 国家搜索
    countrySearchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const countryItems = countryList.querySelectorAll('.country-item');
        
        countryItems.forEach(item => {
            const countryName = item.querySelector('.country-item-name').textContent.toLowerCase();
            const countryCode = item.querySelector('.country-item-code').textContent.toLowerCase();
            
            if (countryName.includes(searchValue) || countryCode.includes(searchValue)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', function() {
        countryDropdown.style.display = 'none';
    });

    countryDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

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

    const searchForm = document.getElementById('searchForm');
    
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

    // 移除嵌套的DOMContentLoaded事件
    // 图标加载动画 - 修改为更可靠的方式
    function initIconCards() {
        const cards = document.querySelectorAll('.icon-card');
        cards.forEach((card, index) => {
            // 设置延迟，使卡片依次显示
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50);
        });
    }
    
    // 初始化图标卡片
    initIconCards();
    
    // 添加MutationObserver监听DOM变化，确保新加载的内容也能应用动画
    const iconGridObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 当有新元素添加到图标网格时，重新初始化卡片动画
                initIconCards();
            }
        });
    });
    
    // 开始观察图标网格的变化
    if (iconGrid) {
        iconGridObserver.observe(iconGrid, { childList: true, subtree: true });
    }
});