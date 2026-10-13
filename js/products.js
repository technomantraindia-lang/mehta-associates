/**
 * Mehta Associates - Product Catalogue & Search Controller
 * Loads verified product data, handles filtering, instant search, and enquiry routing.
 */

(function() {
  'use strict';

  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';

  const gridContainer = document.getElementById('products-grid');
  const searchInput = document.getElementById('product-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const productCountDisplay = document.getElementById('product-count-display');

  async function loadProducts() {
    if (!gridContainer) return;

    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allProducts = await response.json();

      // Check URL parameters for category filter or search query
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      const searchParam = urlParams.get('search') || urlParams.get('q');

      if (searchParam) {
        searchQuery = searchParam;
        if (searchInput) {
          searchInput.value = searchParam;
          if (searchClearBtn) searchClearBtn.style.display = 'block';
        }
      }

      if (catParam) {
        const queryLower = catParam.toLowerCase().trim();
        const matched = allProducts.find(p =>
          p.category.toLowerCase().includes(queryLower) ||
          queryLower.includes(p.category.toLowerCase())
        );
        if (matched) {
          currentCategory = matched.category;
        }
      }

      if (searchParam || catParam) {
        setTimeout(() => {
          const toolbar = document.querySelector('.catalogue-toolbar');
          if (toolbar) {
            toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 250);
      }

      initCategories();
      initDropdownInterceptors();
      renderProducts();
    } catch (error) {
      console.error('Failed to load products:', error);
      gridContainer.innerHTML = `
        <div class="empty-state">
          <h3>Product catalogue could not be loaded</h3>
          <p>Please check your connection or contact our sales desk directly at sales@mehtaassociates.co.in</p>
        </div>
      `;
    }
  }

  const PRODUCT_IMAGE_MAP = {
    'aspirin-granules-ip': 'assets/images/products/aspirin-granules.jpg',
    'aspirin-powder-ip': 'assets/images/products/aspirin-granules.jpg',
    'ambroxol-hcl-ip': 'assets/images/products/ambroxol-hcl.jpg',
    'benzyl-alcohol-ip': 'assets/images/products/benzyl-alcohol.jpg',
    'cetrimide-ip': 'assets/images/products/cetrimide.jpg',
    'strong-cetrimide-solution-40': 'assets/images/products/cetrimide.jpg',
    'chlorhexidine-gluconate-20-ip': 'assets/images/products/antiseptic-solution.jpg',
    'chlorhexidine-hcl-ip': 'assets/images/products/antiseptic-solution.jpg',
    'chromium-picolinate-usp': 'assets/images/products/mineral-chelates.jpg',
    'chromium-polynicotinate': 'assets/images/products/mineral-chelates.jpg',
    'choline-salicylate-bp': 'assets/images/products/pharma-liquid-solution.jpg',
    'diethyl-carbamazine-citrate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'diphenhydramine-hcl-ip': 'assets/images/products/bulk-api-powder.jpg',
    'doss-bp': 'assets/images/products/benzyl-alcohol.jpg',
    'docusate-sodium-powder-85': 'assets/images/products/bulk-api-powder.jpg',
    'eucalyptus-oil': 'assets/images/products/essential-botanical-oils.jpg',
    'iodoform': 'assets/images/products/iodoform-yellow-powder.jpg',
    'lemongrass-oil': 'assets/images/products/essential-botanical-oils.jpg',
    'methyl-nicotinate-bp': 'assets/images/products/pharma-liquid-solution.jpg',
    'methyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'methyl-salicylate-ip': 'assets/images/products/pharma-liquid-solution.jpg',
    'mephenesine-ip': 'assets/images/products/bulk-api-powder.jpg',
    'menthol-bold-crystal': 'assets/images/products/menthol-bold-crystals.jpg',
    'piperazine-citrate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-hexahydrate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-phosphate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-adipate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'propyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'salicylic-acid-ip': 'assets/images/products/salicylic-acid-crystals.jpg',
    'technical-salicylic-acid': 'assets/images/products/industrial-chemicals.jpg',
    'salicylamide-usp': 'assets/images/products/salicylic-acid-crystals.jpg',
    'sodium-methyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'sodium-propyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'sodium-salicylate-ip': 'assets/images/products/salicylic-acid-crystals.jpg',
    'technical-sodium-salicylate': 'assets/images/products/industrial-chemicals.jpg',
    'zinc-picolinate': 'assets/images/products/mineral-chelates.jpg',
    'vitamin-k3-feed': 'assets/images/products/vitamin-k3-feed.jpg',
    'wintergreen-oil': 'assets/images/products/essential-botanical-oils.jpg'
  };

  function getProductImage(product) {
    if (product.image) return product.image;
    if (PRODUCT_IMAGE_MAP[product.id]) return PRODUCT_IMAGE_MAP[product.id];
    return 'assets/images/products/bulk-api-powder.jpg';
  }

  const categoryTabLabels = {
    'all': 'All Products',
    'Active Pharmaceutical Ingredients (APIs)': 'APIs & Bulk Drugs',
    'Preservatives & Excipients': 'Preservatives',
    'Antiseptics & Disinfectants': 'Antiseptics',
    'Minerals & Nutritional Supplements': 'Nutraceuticals',
    'Essential Oils & Botanicals': 'Essential Oils',
    'Technical & Industrial Chemicals': 'Speciality Chemicals'
  };

  function formatCategoryShort(cat) {
    const map = {
      'Active Pharmaceutical Ingredients (APIs)': 'Active API',
      'Preservatives & Excipients': 'Preservative',
      'Antiseptics & Disinfectants': 'Antiseptic',
      'Minerals & Nutritional Supplements': 'Nutraceutical',
      'Essential Oils & Botanicals': 'Essential Oil',
      'Technical & Industrial Chemicals': 'Speciality Chemical'
    };
    return map[cat] || cat;
  }

  function formatGradeShort(grade) {
    if (!grade) return 'Pharma Grade';
    if ((grade.includes('I P') || grade.includes('IP')) && grade.includes('BP') && grade.includes('USP')) return 'I P / B P / U S P';
    if ((grade.includes('I P') || grade.includes('IP')) && grade.includes('BP')) return 'I P / B P Grade';
    if (grade.includes('I P') || grade.includes('IP')) return 'I P Monograph';
    if (grade.includes('BP')) return 'BP Monograph';
    if (grade.includes('USP')) return 'USP Monograph';
    if (grade.includes('EP')) return 'EP Monograph';
    if (grade.includes('Nutraceutical')) return 'Food / Nutra';
    if (grade.includes('Technical')) return 'Technical';
    return grade.split('/')[0].trim();
  }

  function initCategories() {
    if (!categoryTabsContainer) return;

    // Extract unique categories
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];

    categoryTabsContainer.innerHTML = categories.map(cat => {
      const label = categoryTabLabels[cat] || (cat === 'all' ? 'All Products' : cat);
      const count = cat === 'all' ? allProducts.length : allProducts.filter(p => p.category === cat).length;
      return `
        <button type="button" class="tab-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
          <span>${escapeHtml(label)}</span>
          <span class="tab-count">${count}</span>
        </button>
      `;
    }).join('');

    // Bind tab clicks
    categoryTabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        selectCategory(cat, true, false);
      });
    });
  }

  function selectCategory(categoryName, updateHistory = true, scroll = false) {
    currentCategory = categoryName;
    if (categoryTabsContainer) {
      categoryTabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === currentCategory);
      });
    }
    renderProducts();

    if (updateHistory) {
      const url = new URL(window.location.href);
      if (currentCategory === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', currentCategory);
      }
      window.history.pushState({ category: currentCategory }, '', url.toString());
    }

    if (scroll) {
      const toolbar = document.querySelector('.catalogue-toolbar');
      if (toolbar) {
        toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function initDropdownInterceptors() {
    // Intercept dropdown & mobile submenu clicks when already on products.html
    document.querySelectorAll('.dropdown-categories-grid a, .mobile-submenu a, .dropdown-menu-header a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!gridContainer) return;
        const href = link.getAttribute('href');
        if (!href) return;
        try {
          const url = new URL(href, window.location.origin);
          const cat = url.searchParams.get('category');
          if (cat) {
            e.preventDefault();
            const queryLower = cat.toLowerCase().trim();
            const matched = allProducts.find(p =>
              p.category.toLowerCase().includes(queryLower) ||
              queryLower.includes(p.category.toLowerCase())
            );
            if (matched) {
              selectCategory(matched.category, true, true);
            }
          } else if (href.includes('products.html') && !cat) {
            e.preventDefault();
            selectCategory('all', true, true);
          }
        } catch (err) {}
      });
    });

    window.addEventListener('popstate', () => {
      if (!gridContainer) return;
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        const queryLower = catParam.toLowerCase().trim();
        const matched = allProducts.find(p =>
          p.category.toLowerCase().includes(queryLower) ||
          queryLower.includes(p.category.toLowerCase())
        );
        if (matched) {
          selectCategory(matched.category, false, false);
          return;
        }
      }
      selectCategory('all', false, false);
    });
  }

  function filterProducts() {
    return allProducts.filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const rawQuery = searchQuery.toLowerCase().trim();
      if (!rawQuery) return matchesCategory;

      const normTerm = s => (s || '').toLowerCase().replace(/\bi\s*p\b/g, 'i p');
      const itemFullText = normTerm(`${item.name} ${item.description || ''} ${item.grade || ''} ${item.cas || ''} ${item.applications || ''}`);
      
      const queryTokens = normTerm(rawQuery).split(/\s+/).filter(Boolean);
      const consolidatedTokens = [];
      for (let i = 0; i < queryTokens.length; i++) {
        if (queryTokens[i] === 'i' && queryTokens[i + 1] === 'p') {
          consolidatedTokens.push('i p');
          i++;
        } else {
          consolidatedTokens.push(queryTokens[i]);
        }
      }

      const matchesQuery = consolidatedTokens.every(token => itemFullText.includes(token));
      return matchesCategory && matchesQuery;
    });
  }

  function renderProducts() {
    if (!gridContainer) return;

    const filtered = filterProducts();

    // Check if on homepage and limited display requested
    const isHomepage = gridContainer.getAttribute('data-limit');
    let itemsToDisplay = filtered;
    if (isHomepage) {
      const limit = parseInt(isHomepage, 10);
      const homepageIds = ['aspirin-granules-ip', 'ambroxol-hcl-ip', 'cetrimide-ip', 'benzyl-alcohol-ip'];
      const featuredItems = allProducts.filter(p => homepageIds.includes(p.id));
      itemsToDisplay = (featuredItems.length >= limit) ? featuredItems.slice(0, limit) : filtered.slice(0, limit);
    }

    if (productCountDisplay) {
      productCountDisplay.textContent = `Showing ${filtered.length} of ${allProducts.length} verified products`;
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3>No matching products found</h3>
          <p>No products match "${escapeHtml(searchQuery)}". Try searching by generic chemical name, pharmacopoeia standard (I P, B P, U S P), or clear your filters.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-filter-btn" style="margin-top: 1rem;">
            Reset Search &amp; Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (searchClearBtn) searchClearBtn.style.display = 'none';
          currentCategory = 'all';
          initCategories();
          renderProducts();
        });
      }
      return;
    }

    gridContainer.innerHTML = itemsToDisplay.map(product => {
      const waText = encodeURIComponent(`Hello Mehta Associates, I would like to enquire about bulk availability, pricing, and COA for: ${product.name}`);
      const waLink = `https://wa.me/919324283220?text=${waText}`;

      return `
        <div class="product-card reveal-on-scroll">
          <div class="product-card-body">
            <div class="product-card-header">
              <span class="badge-category">${escapeHtml(formatCategoryShort(product.category))}</span>
              <span class="badge-grade">${escapeHtml(formatGradeShort(product.grade))}</span>
            </div>

            <h3 class="product-title" title="${escapeHtml(product.name)}">
              <a href="product-detail.html?id=${encodeURIComponent(product.id)}" class="product-title-link">
                ${escapeHtml(product.name)}
              </a>
            </h3>

            <div class="product-meta-row">
              <span class="product-cas-pill">
                <i data-lucide="tag" style="width: 11px; height: 11px;"></i>
                <span>CAS: ${escapeHtml(product.cas || 'Monograph')}</span>
              </span>
              <span class="product-coa-pill">
                <i data-lucide="shield-check" style="width: 11px; height: 11px;"></i>
                <span>COA Verified</span>
              </span>
            </div>

            <p class="product-desc" title="${escapeHtml(product.description || '')}">
              ${escapeHtml(product.description || 'High-purity certified pharmaceutical grade compound.')}
            </p>

            <div class="product-apps-box" title="${escapeHtml(product.applications || '')}">
              <div class="apps-header">
                <i data-lucide="activity" style="width: 12px; height: 12px;"></i>
                <span class="apps-label">Key Applications</span>
              </div>
              <span class="apps-text">${escapeHtml(product.applications || 'Pharmaceutical formulations and compounding')}</span>
            </div>
          </div>

          <div class="product-card-footer">
            <a href="product-detail.html?id=${encodeURIComponent(product.id)}" class="btn-product-view" title="View Full Monograph & Specifications for ${escapeHtml(product.name)}">
              <i data-lucide="file-text" style="width: 13px; height: 13px;"></i>
              <span>Monograph &amp; Specs</span>
            </a>
            <div class="product-card-action-row">
              <button type="button" class="btn btn-product-enquiry product-action-btn" onclick="openEnquiryModal('${escapeHtml(product.name)}')">
                <i data-lucide="send" style="width: 13px; height: 13px;"></i>
                <span>Enquire</span>
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-product-wa product-wa-btn" title="Enquire on WhatsApp for ${escapeHtml(product.name)}" data-analytics-wa="Kamlesh Mehta">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true" style="flex-shrink: 0;"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.55 15.16 4.13 13.56 4.13 11.91C4.13 7.37 7.83 3.67 12.04 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.09 8.03 12.25C8.16 12.41 9.77 14.9 12.24 15.97C12.83 16.22 13.28 16.37 13.64 16.49C14.23 16.67 14.78 16.65 15.21 16.58C15.69 16.51 16.68 15.98 16.89 15.4C17.09 14.81 17.09 14.31 17.03 14.21C16.97 14.1 16.81 14.04 16.56 13.92C16.32 13.79 15.11 13.2 14.88 13.12C14.66 13.03 14.5 12.99 14.33 13.24C14.17 13.48 13.71 14.04 13.57 14.21C13.43 14.37 13.29 14.39 13.04 14.27C12.8 14.14 12.01 13.89 11.08 13.06C10.36 12.41 9.87 11.61 9.73 11.37C9.59 11.12 9.71 10.99 9.84 10.86C9.95 10.75 10.08 10.57 10.21 10.42C10.33 10.28 10.37 10.17 10.45 10.01C10.54 9.84 10.49 9.7 10.43 9.58C10.37 9.45 9.9 8.31 9.71 7.84C9.52 7.39 9.33 7.45 9.18 7.44C9.05 7.43 8.89 7.43 8.73 7.43C8.57 7.43 8.53 7.33 8.53 7.33Z"/></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Trigger scroll reveal observer on newly created items
    const newItems = gridContainer.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && newItems.length > 0) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      newItems.forEach(i => observer.observe(i));
    } else {
      newItems.forEach(i => i.classList.add('is-revealed'));
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Search input handling with debounce
  let searchTimeout = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
      }

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        renderProducts();
        if (window.Analytics && searchQuery.trim().length > 2) {
          const count = filterProducts().length;
          window.Analytics.trackProductSearch(searchQuery.trim(), count);
        }
      }, 250);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.style.display = 'none';
      renderProducts();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', loadProducts);
})();
