/* ============================================================
   TANU — index.js
   Попover-меню морозива: Strapi API, пошук, категорії, fallback
   ============================================================ */

(function () {
  'use strict';

  /* ── КОНФІГУРАЦІЯ ──────────────────────────────────────────
     Замініть наступні значення на реальні URL:
     - STRAPI_BASE: базовий URL вашого Strapi (без слеша в кінці)
     - STRAPI_PATH: шлях до колекції товарів
     - BOND_URL:    посилання на сторінку замовлення в Бонд-магазині
  ─────────────────────────────────────────────────────────── */
  var CONFIG = {
    STRAPI_BASE:      'https://brilliant-butterfly-87018121a7.strapiapp.com/',     // ← ЗАМІНІТЬ на URL Strapi Cloud
    STRAPI_PATH:      '/api/products?populate=*',
    API_TOKEN:        '83a7e8b445e4af9f049ebfa007cd808120001531639e790761d33655dfc1f3be9fd419eb8b12f1908164d569571c38cfa00f0f73f1d1d8553e15a3fe9306834d88fe4cc070acf2aed23e9519e8945d00e3cd57f4aa69a8bd576f99d9fbba5668193049f2e5c8984c7943801b0218aaca7426155aabf5e5a4941e9377fb91dbd1',                                 // ← ЗАМІНІТЬ на API Token зі Strapi
    FETCH_TIMEOUT_MS: 5000
  };

  /* ── КАТЕГОРІЇ ─────────────────────────────────────────── */
  var CATEGORIES = [
    { key: 'all',       label: 'Всі' },
    { key: 'ice-cream', label: 'Морозиво' },
    { key: 'sorbet',    label: 'Сорбети' },
    { key: 'jar',       label: 'Морозиво в банці' },
    { key: 'cone',      label: 'Рожки' }
  ];

  /* ── СТАН ─────────────────────────────────────────────── */
  var state = {
    products: [],
    loaded: false,
    activeCategory: 'all',
    query: ''
  };

  /* ── DOM-посилання ──────────────────────────────────────
     Елементи підтягуються після DOMContentLoaded
  ─────────────────────────────────────────────────────── */
  var el = {};

  /* ── ІНІЦІАЛІЗАЦІЯ ─────────────────────────────────────── */
  function init() {
    el.overlay      = document.getElementById('menu-overlay');
    el.popover      = document.getElementById('menu-popover');
    el.btnMenu      = document.getElementById('btn-menu');
    el.btnClose     = document.getElementById('popover-close');
    el.search       = document.getElementById('product-search');
    el.catTabs      = document.getElementById('category-tabs');
    el.productList  = document.getElementById('product-list');
    el.listWrapper  = document.getElementById('product-list-wrapper');

    if (!el.overlay || !el.btnMenu) return; // захист від відсутніх елементів

    buildCategoryTabs();
    bindEvents();

    // Завантажуємо дані для меню одразу, не чекаючи відкриття
    loadProducts();

    // Показуємо кнопку меню коли Hype сцена провантажиться
    // Hype додає event listener на window для HypeDocuments
    waitForHypeReady();
  }

  /* ── ЧЕКАЄМО HYPE СЦЕНИ ─────────────────────────────────── */
  function waitForHypeReady() {
    var shown = false;

    function showButton() {
      if (shown) return;
      shown = true;
      setTimeout(function () {
        el.btnMenu.parentElement.classList.add('is-visible');
      }, 300);
    }

    // Показуємо кнопку коли сторінка завантажилась
    if (document.readyState === 'complete') {
      showButton();
    } else {
      window.addEventListener('load', function () {
        showButton();
      });
    }

    // Fallback: якщо load не спрацює за 4 секунди — показуємо
    setTimeout(showButton, 4000);
  }

  /* ── КАТЕГОРІЇ: побудова вкладок ─────────────────────── */
  function buildCategoryTabs() {
    el.catTabs.innerHTML = CATEGORIES.map(function (cat) {
      var active = cat.key === 'all' ? ' active' : '';
      return '<button class="cat-tab' + active + '" data-cat="' + cat.key + '">' + cat.label + '</button>';
    }).join('');
  }

  function resetCategoryTabs() {
    el.catTabs.querySelectorAll('.cat-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.cat === 'all');
    });
  }

  /* ── ПОДІЇ ─────────────────────────────────────────────── */
  function bindEvents() {
    // Відкрити меню
    el.btnMenu.addEventListener('click', openMenu);

    // Закрити: кнопка ✕
    el.btnClose.addEventListener('click', closeMenu);

    // Закрити: клік на затемнення поза попover
    el.overlay.addEventListener('click', function (e) {
      if (e.target === el.overlay) closeMenu();
    });

    // Закрити: Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Пошук
    el.search.addEventListener('input', function () {
      state.query = this.value.trim().toLowerCase();
      el.search.parentElement.classList.toggle('has-value', this.value.length > 0);
      renderProducts();
    });

    // Очистити пошук
    el.searchClear = document.getElementById('search-clear');
    el.searchClear.addEventListener('click', function () {
      el.search.value = '';
      state.query = '';
      el.search.parentElement.classList.remove('has-value');
      el.search.focus();
      renderProducts();
    });

    // Натискання на вкладку категорії
    el.catTabs.addEventListener('click', function (e) {
      var tab = e.target.closest('.cat-tab');
      if (!tab) return;
      state.activeCategory = tab.dataset.cat;
      el.catTabs.querySelectorAll('.cat-tab').forEach(function (t) {
        t.classList.toggle('active', t === tab);
      });
      renderProducts();
    });

    // Свайп вниз для закриття на мобільному
    bindSwipeToClose();
  }

  /* ── SWIPE DOWN TO CLOSE (мобільний) ───────────────────── */
  function bindSwipeToClose() {
    var startY = 0;
    var currentY = 0;
    var isDragging = false;
    var isAtTop = false;
    var threshold = 80; // px свайпу для закриття
    var hasMoved = false;
    var rafId = null;

    function clearRAF() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    el.popover.addEventListener('touchstart', function (e) {
      startY = e.touches[0].clientY;
      // перевіряємо, чи скрол на самому верху
      isAtTop = el.productList.scrollTop <= 0;
      isDragging = true;
      hasMoved = false;
      clearRAF();
      // скасовуємо transition для плавного drag
      el.popover.style.transition = 'none';
    }, { passive: true });

    el.popover.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      var diff = currentY - startY;

      // тягнемо вниз тільки якщо скрол наверху і рух вниз
      if (isAtTop && diff > 10) {
        hasMoved = true;
        el.productList.style.overflow = 'hidden';
        // використовуємо requestAnimationFrame для плавної анімації
        clearRAF();
        rafId = requestAnimationFrame(function () {
          el.popover.style.transform = 'translateY(' + diff + 'px)';
        });
      }
    }, { passive: true });

    el.popover.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      clearRAF();
      el.productList.style.overflow = '';

      var diff = currentY - startY;

      if (isAtTop && hasMoved && diff > threshold) {
        closeMenuWithSwipe();
      } else if (hasMoved) {
        // повертаємо назад з анімацією
        el.popover.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
        el.popover.style.transform = 'translateY(0)';
        // повністю скидаємо transition та transform після анімації
        setTimeout(function () {
          el.popover.style.transition = '';
          el.popover.style.transform = '';
          hasMoved = false;
        }, 160);
      } else {
        hasMoved = false;
      }

      startY = 0;
      currentY = 0;
      isAtTop = false;
    }, { passive: true });

    function closeMenuWithSwipe() {
      el.popover.style.transition = 'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)';
      el.popover.style.transform = 'translateY(100%)';
      // спочатку ховаємо overlay (opacity), потім скидаємо popover styles
      setTimeout(function () {
        el.overlay.classList.remove('is-open');
        setTimeout(function () {
          document.body.style.overflow = '';
          el.search.value = '';
          state.query = '';
          state.activeCategory = 'all';
          resetCategoryTabs();
          isClosing = false;
          // скидаємо popover styles після повного закриття
          el.popover.style.transition = '';
          el.popover.style.transform = '';
          hasMoved = false;
        }, 110);
      }, 80);
    }
  }

  /* ── ВІДКРИТИ / ЗАКРИТИ ─────────────────────────────────── */
  var isClosing = false;

  function openMenu() {
    if (isClosing) return;
    el.overlay.classList.add('is-open');
    el.overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    // Скидаємо пошук і категорію на дефолт при кожному відкритті
    el.search.value = '';
    state.query = '';
    state.activeCategory = 'all';
    resetCategoryTabs();
    el.search.parentElement.classList.remove('has-value');
    // Дані вже завантажені при init(), не треба знову викликати loadProducts()
    if (!state.loaded) {
      showLoading();
    } else {
      renderProducts();
    }
  }

  function closeMenu() {
    if (isClosing) return;
    if (!el.overlay.classList.contains('is-open')) return;

    isClosing = true;
    el.overlay.classList.remove('is-open');

    // чекаємо завершення transition (opacity 0.1s) перед відновленням скролу
    setTimeout(function () {
      document.body.style.overflow = '';
      el.search.value = '';
      state.query = '';
      // скидаємо категорію на "всі" при закритті
      state.activeCategory = 'all';
      resetCategoryTabs();
      isClosing = false;
    }, 110);
  }

  /* ── ЗАВАНТАЖЕННЯ ТОВАРІВ ────────────────────────────────── */
  function loadProducts() {
    if (state.loaded) {
      renderProducts();
      return;
    }

    showLoading();

    var url = CONFIG.STRAPI_BASE + CONFIG.STRAPI_PATH;
    var controller;
    var timer;

    try {
      controller = new AbortController();
      timer = setTimeout(function () { controller.abort(); }, CONFIG.FETCH_TIMEOUT_MS);
    } catch (_) {
      controller = null;
    }

    var fetchHeaders = {};
    if (CONFIG.API_TOKEN) fetchHeaders['Authorization'] = 'Bearer ' + CONFIG.API_TOKEN;
    var fetchOpts = controller
      ? { signal: controller.signal, headers: fetchHeaders }
      : { headers: fetchHeaders };

    fetch(url, fetchOpts)
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        state.products = normalizeStrapi(json);
        if (state.products.length === 0) throw new Error('Empty response');
        state.loaded = true;
        renderProducts();
      })
      .catch(function (err) {
        clearTimeout(timer);
        console.warn('[TANU] Strapi недоступний, використовую fallback:', err.message);
        useFallback();
      });
  }

  function useFallback() {
    var fallback = window.TANU_FALLBACK_PRODUCTS;
    if (Array.isArray(fallback) && fallback.length > 0) {
      state.products = fallback;
    } else {
      state.products = [];
    }
    state.loaded = true;
    renderProducts();
  }

  /* ── НОРМАЛІЗАЦІЯ ВІДПОВІДІ STRAPI ──────────────────────── */
  function normalizeStrapi(json) {
    var base = CONFIG.STRAPI_BASE;

    function resolveImgUrl(img) {
      if (!img) return null;
      // Strapi v5: img.url напряму
      var url = img.url || (img.data && img.data.attributes && img.data.attributes.url);
      if (!url) return null;
      return url.startsWith('http') ? url : base + url;
    }

    function resolveCategoryKey(cat) {
      if (!cat) return '';
      // Strapi v5: cat — об'єкт { key, name }
      if (typeof cat === 'object') return cat.key || slugifyCategory(cat.name || '');
      // Strapi v4: рядок або { data: { attributes: { key } } }
      if (cat.data && cat.data.attributes) return cat.data.attributes.key || '';
      return slugifyCategory(String(cat));
    }

    // Strapi v5 / v4: { data: [...] }
    if (json && Array.isArray(json.data)) {
      return json.data.map(function (item) {
        // v5: поля напряму на item; v4: у item.attributes
        var src = (item.attributes && Object.keys(item.attributes).length) ? item.attributes : item;
        return {
          id:          item.id,
          name:        src.title || src.name || '—',
          category:    resolveCategoryKey(src.category),
          price:       src.price ? src.price + ' грн' : '',
          description: src.description || '',
          image:       resolveImgUrl(src.image),
          slug:        src.slug || String(item.id)
        };
      });
    }

    // Плоский масив (v3 або кастомний ендпоінт)
    if (Array.isArray(json)) {
      return json.map(function (item) {
        return {
          id:          item.id,
          name:        item.title || item.name || '—',
          category:    resolveCategoryKey(item.category),
          price:       item.price ? item.price + ' грн' : '',
          description: item.description || '',
          image:       resolveImgUrl(item.image),
          slug:        item.slug || String(item.id)
        };
      });
    }

    return [];
  }

  // Перетворює назву категорії на ключ (напр. "Ice Cream" → "ice-cream")
  function slugifyCategory(str) {
    return String(str).trim().toLowerCase().replace(/\s+/g, '-');
  }

  /* ── ФІЛЬТРАЦІЯ ─────────────────────────────────────────── */
  function getFiltered() {
    return state.products.filter(function (p) {
      var hasImage = p.image && p.image !== '';
      var matchCat  = state.activeCategory === 'all' || p.category === state.activeCategory;
      var matchText = !state.query ||
        p.name.toLowerCase().includes(state.query) ||
        p.description.toLowerCase().includes(state.query);
      return hasImage && matchCat && matchText;
    });
  }

  /* ── РАНДОМНІ КАРТИНКИ З FALLBACK ───────────────────────── */
  // Доступні картинки з fallback-data.js для підстановки замість сірого квадрата
  var FALLBACK_IMAGES = [
    "Tanu.hyperesources/тайський чай.png",
    "Tanu.hyperesources/матча + полуниця.png",
    "Tanu.hyperesources/кунжут чорний.png",
    "Tanu.hyperesources/макадамія.png",
    "Tanu.hyperesources/анчан.png",
    "Tanu.hyperesources/малина.png",
    "Tanu.hyperesources/манго.png",
    "Tanu.hyperesources/гранат.png",
    "Tanu.hyperesources/жасмин + порічка.png",
    "Tanu.hyperesources/полуниця + базилік.png",
    "Tanu.hyperesources/персик + розмарин.png",
    "Tanu.hyperesources/йогурт + лохина.png",
    "Tanu.hyperesources/куркума.png",
    "Tanu.hyperesources/тану_6511.png",
    "Tanu.hyperesources/тану_6511-1.png",
    "Tanu.hyperesources/тану24_5328.png"
  ];

  function getRandomImage() {
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  }

  /* ── ВІДОБРАЖЕННЯ ТОВАРІВ ───────────────────────────────── */
  function renderProducts() {
    var items = getFiltered();

    if (items.length === 0) {
      el.productList.innerHTML =
        '<div class="product-list-wrapper"><div class="empty-state">Нічого не знайдено&nbsp;🍦<br>' +
        '<small style="font-size:12px;margin-top:4px;display:block;">Спробуйте інший запит або категорію</small></div></div>';
      return;
    }

    el.productList.innerHTML = '<div class="product-list-wrapper">' +
      items.map(productCardHTML).join('') +
      '</div>';
  }

  function productCardHTML(p) {
    var imgSrc  = p.image && p.image !== '' ? p.image : getRandomImage();
    var randomFallback = getRandomImage();
    var imgFail = "this.onerror=function(){this.src='" + randomFallback + "';this.onerror=null;}";

    var priceHTML = p.price
      ? '<span class="product-price">' + esc(p.price) + '</span>'
      : '';

    var descHTML = p.description
      ? '<div class="product-desc">' + esc(p.description) + '</div>'
      : '';

    return (
      '<a href="https://bond.delivery/restaurant/tanu/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleAQ9TXFleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeOds1LgrXisoBvIpQNFS1h1PaVhr6GrE-4ud0GZXHfGB-M741_Iv3z62a82g_aem_IrubfzRK94tPga4_gmo9Ew" class="product-item" target="_blank" rel="noopener noreferrer">' +
        '<div class="product-item-inner">' +
          '<div class="product-img-wrap">' +
            '<img src="' + esc(imgSrc) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="' + imgFail + '">' +
          '</div>' +
          '<div class="product-info">' +
            '<div class="product-name">' + esc(p.name) + '</div>' +
            descHTML +
          '</div>' +
          '<div class="product-right">' +
            priceHTML +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function showLoading() {
    el.productList.innerHTML = '<div class="product-list-wrapper"><div class="empty-state">Завантаження...</div></div>';
  }

  /* ── УТИЛІТИ ────────────────────────────────────────────── */
  // Екранування HTML (захист від XSS при вставці даних зі Strapi)
  function esc(str) {
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  /* ── СТАРТ ──────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init(); // DOM вже готовий
  }

})();
