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

      // Check URL parameters for category filter
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
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

      initCategories();
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

  const categoryTabLabels = {
    'all': 'All Products',
    'Active Pharmaceutical Ingredients (APIs)': 'APIs & Bulk Drugs',
    'Preservatives & Excipients': 'Preservatives & Excipients',
    'Antiseptics & Disinfectants': 'Antiseptics & Disinfectants',
    'Minerals & Nutritional Supplements': 'Nutraceuticals & Minerals',
    'Essential Oils & Botanicals': 'Essential Oils',
    'Technical & Industrial Chemicals': 'Industrial Chemicals'
  };

  function formatCategoryShort(cat) {
    const map = {
      'Active Pharmaceutical Ingredients (APIs)': 'API / Bulk Drug',
      'Preservatives & Excipients': 'Preservative / Excipient',
      'Antiseptics & Disinfectants': 'Antiseptic & Disinfectant',
      'Minerals & Nutritional Supplements': 'Nutraceutical',
      'Essential Oils & Botanicals': 'Botanical Oil',
      'Technical & Industrial Chemicals': 'Industrial Grade'
    };
    return map[cat] || cat;
  }

  function formatGradeShort(grade) {
    if (!grade) return 'Pharma Grade';
    if (grade.includes('IP')) return 'IP Monograph';
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
        categoryTabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderProducts();
      });
    });
  }

  function filterProducts() {
    return allProducts.filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.grade && item.grade.toLowerCase().includes(query)) ||
        (item.cas && item.cas.toLowerCase().includes(query)) ||
        (item.applications && item.applications.toLowerCase().includes(query));

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
          <p>No products match "${escapeHtml(searchQuery)}". Try searching by generic chemical name, pharmacopoeia standard (IP, BP, USP), or clear your filters.</p>
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

            <h3 class="product-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>

            <div class="product-meta-row">
              <span class="product-cas-pill">CAS ${escapeHtml(product.cas || 'Monograph')}</span>
            </div>

            <p class="product-desc" title="${escapeHtml(product.description || '')}">
              ${escapeHtml(product.description || 'High-purity certified pharmaceutical grade compound.')}
            </p>

            <div class="product-apps-box" title="${escapeHtml(product.applications || '')}">
              <span class="apps-label">Key Applications:</span>
              <span class="apps-text">${escapeHtml(product.applications || 'Pharmaceutical formulations and compounding')}</span>
            </div>
          </div>

          <div class="product-card-footer">
            <button type="button" class="btn btn-primary btn-sm product-action-btn" onclick="openEnquiryModal('${escapeHtml(product.name)}')">
              <span>Enquire Now</span>
            </button>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm product-wa-btn" title="Enquire on WhatsApp" data-analytics-wa="Kamlesh Mehta">
              <span>WhatsApp</span>
            </a>
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
