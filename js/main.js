/**
 * Mehta Associates - Main Application Controller
 * Handles UI interactions, navigation, preloader, stats counting, and modal states.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Loading Animation Dismissal
  const preloader = document.getElementById('site-preloader');
  if (preloader) {
    // Dismiss as soon as possible, with smooth fade out
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 250);
    });
    // Fallback safety timeout: never block longer than 800ms
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 800);
  }

  // 2. Sticky Header Elevation on Scroll
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2B. Header Live Word Rotator Animation (Unique word switcher)
  const rotatingWordEl = document.getElementById('header-rotating-word');
  if (rotatingWordEl) {
    const sourcingWords = [
      'Active APIs',
      'Bulk Drugs',
      'Pharma Excipients',
      'Fine Chemicals',
      'Essential Oils',
      'Technical Grades',
      'I P • B P • U S P'
    ];
    let currentWordIndex = 0;

    setInterval(() => {
      rotatingWordEl.classList.add('flip-out');

      setTimeout(() => {
        currentWordIndex = (currentWordIndex + 1) % sourcingWords.length;
        rotatingWordEl.textContent = sourcingWords[currentWordIndex];
        rotatingWordEl.classList.remove('flip-out');
        rotatingWordEl.classList.add('flip-in');

        // Force browser repaint to trigger entrance transition
        void rotatingWordEl.offsetWidth;

        setTimeout(() => {
          rotatingWordEl.classList.remove('flip-in');
        }, 400);
      }, 350);
    }, 2500);
  }

  // 2C. Top Bar Corporate Highlights Ticker (Dynamic rotating phrase)
  const topTickerEl = document.getElementById('top-ticker-text');
  if (topTickerEl) {
    const highlights = [
      'Celebrating 41 Years of Sourcing Excellence (Est. 1985)',
      'Guaranteed I P • B P • U S P Pharmacopoeia Standards',
      'Motto: "Quantity is Must, But Quality is First"',
      'Direct Manufacturer Indenting & Mumbai Logistics',
      'Trusted Partner to 2,250+ Customers'
    ];
    let highlightIndex = 0;

    setInterval(() => {
      topTickerEl.classList.add('sliding-out');

      setTimeout(() => {
        highlightIndex = (highlightIndex + 1) % highlights.length;
        topTickerEl.textContent = highlights[highlightIndex];
        topTickerEl.classList.remove('sliding-out');
        topTickerEl.classList.add('sliding-in');

        void topTickerEl.offsetWidth;

        setTimeout(() => {
          topTickerEl.classList.remove('sliding-in');
        }, 450);
      }, 400);
    }, 3800);
  }

  // 2D. Hero Banner Slider Controller (Unified Corporate Banner)
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-unified-slide, .panorama-slide, .hero-slide');
    const tabs = document.querySelectorAll('.hero-tab, .panorama-tab, .slider-tab');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const dynamicTag = document.getElementById('hero-dynamic-tag');
    const dynamicTitle = document.getElementById('hero-dynamic-title');
    const dynamicDesc = document.getElementById('hero-dynamic-desc');
    const floatingText = document.getElementById('hero-floating-text');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideTimer = null;
    const slideDuration = 5500;

    function goToSlide(index) {
      if (totalSlides === 0) return;
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;

      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
      });

      const activeSlideEl = slides[currentSlide];
      const heroSection = document.getElementById('hero');
      const sealShowcase = document.getElementById('hero-seal-showcase');

      if (activeSlideEl) {
        const isBanner = activeSlideEl.dataset.type === 'banner';
        const isSeal = activeSlideEl.dataset.type === 'seal';

        if (heroSection) {
          heroSection.classList.toggle('is-banner-mode', isBanner);
        }

        if (sealShowcase) {
          sealShowcase.classList.toggle('active', isSeal);
        }

        if (dynamicTag && activeSlideEl.dataset.tag) {
          dynamicTag.innerHTML = activeSlideEl.dataset.tag;
        }
        if (dynamicTitle && activeSlideEl.dataset.title) {
          dynamicTitle.style.opacity = '0';
          setTimeout(() => {
            dynamicTitle.innerHTML = activeSlideEl.dataset.title;
            dynamicTitle.style.opacity = '1';
          }, 150);
        }
        if (dynamicDesc && activeSlideEl.dataset.desc) {
          dynamicDesc.style.opacity = '0';
          setTimeout(() => {
            dynamicDesc.textContent = activeSlideEl.dataset.desc;
            dynamicDesc.style.opacity = '1';
          }, 150);
        }
        if (floatingText && activeSlideEl.dataset.indicator) {
          floatingText.innerHTML = activeSlideEl.dataset.indicator;
        }
      }

      tabs.forEach((tab, idx) => {
        const isActive = idx === currentSlide;
        tab.classList.toggle('active', isActive);
        const fill = tab.querySelector('.tab-line-fill, .tab-progress-bar, .tab-progress-fill');
        if (fill) {
          if (isActive) {
            fill.style.transition = 'none';
            fill.style.width = '0%';
            void fill.offsetWidth; // force reflow
            fill.style.transition = `width ${slideDuration}ms linear`;
            fill.style.width = '100%';
          } else {
            fill.style.transition = 'none';
            fill.style.width = '0%';
          }
        }
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = parseInt(tab.getAttribute('data-slide-target'), 10);
        goToSlide(target);
        startAutoSlide();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);

    // Initial setup
    goToSlide(0);
    startAutoSlide();
  }

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  function openMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileNav);
  }

  window.openMobileNav = openMobileNav;
  window.closeMobileNav = closeMobileNav;

  const drawerCloseBtn = document.querySelector('.mobile-drawer-close-btn');
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileNav);
  }

  // Close mobile nav on link click or ESC
  document.querySelectorAll('.mobile-nav-links .nav-link, .mobile-submenu-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Mobile submenu accordion
  const mobileSubmenuToggle = document.querySelector('.mobile-submenu-toggle');
  const mobileSubmenu = document.querySelector('.mobile-submenu');
  if (mobileSubmenuToggle && mobileSubmenu) {
    mobileSubmenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = mobileSubmenu.classList.toggle('open');
      mobileSubmenuToggle.classList.toggle('open', isOpen);
      mobileSubmenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Desktop dropdown hover buffer and click controller
  const navDropdowns = document.querySelectorAll('.nav-item-dropdown');
  navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const panel = dropdown.querySelector('.dropdown-menu-panel');
    let closeTimer = null;

    const openDropdown = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      dropdown.classList.add('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    };

    const scheduleClose = () => {
      if (closeTimer) clearTimeout(closeTimer);
      // 300ms grace buffer ensures moving cursor down into the menu never loses hover
      closeTimer = setTimeout(() => {
        dropdown.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }, 300);
    };

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('mouseleave', scheduleClose);

    if (panel) {
      panel.addEventListener('mouseenter', openDropdown);
      panel.addEventListener('mouseleave', scheduleClose);
    }

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('is-open')) {
          e.preventDefault();
          openDropdown();
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    navDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeModal();
      closeWhatsAppPopup();
      navDropdowns.forEach(dropdown => {
        dropdown.classList.remove('is-open');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // 4. Scroll Reveal Animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if observer not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 5. Statistics Counter Animation
  const counterElements = document.querySelectorAll('.counter-val');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-target'), 10);
          if (!isNaN(targetNum)) {
            animateNumber(el, targetNum);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateNumber(element, target) {
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * ease);

      element.textContent = current.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('en-IN');
      }
    }

    requestAnimationFrame(update);
  }

  // 6. Floating WhatsApp Widget
  const waTrigger = document.querySelector('.whatsapp-trigger-btn');
  const waPopup = document.querySelector('.whatsapp-popup');
  const waClose = document.querySelector('.whatsapp-close-btn');

  function openWhatsAppPopup() {
    if (waPopup) waPopup.classList.add('active');
  }

  function closeWhatsAppPopup() {
    if (waPopup) waPopup.classList.remove('active');
  }

  if (waTrigger) {
    waTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (waPopup.classList.contains('active')) {
        closeWhatsAppPopup();
      } else {
        openWhatsAppPopup();
      }
    });
  }

  if (waClose) {
    waClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWhatsAppPopup();
    });
  }

  document.addEventListener('click', (e) => {
    if (waPopup && waPopup.classList.contains('active') && !waPopup.contains(e.target) && e.target !== waTrigger) {
      closeWhatsAppPopup();
    }
  });

  // Track WhatsApp links
  document.querySelectorAll('[data-analytics-wa]').forEach(btn => {
    btn.addEventListener('click', () => {
      const partner = btn.getAttribute('data-analytics-wa');
      if (window.Analytics) {
        window.Analytics.trackWhatsAppClick(partner);
      }
    });
  });

  // Track Brochure Downloads & Views
  document.querySelectorAll('[data-analytics-brochure]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-analytics-brochure');
      if (window.Analytics) {
        if (action === 'download') window.Analytics.trackBrochureDownload();
        else window.Analytics.trackBrochureView();
      }
    });
  });

  // 7. Modal System
  const modalBackdrop = document.getElementById('enquiry-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  window.openEnquiryModal = function(productName = '') {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    const reqField = document.getElementById('modal-requirement');
    if (reqField && productName) {
      reqField.value = `Enquiring regarding bulk availability, pricing, and COA for: ${productName}`;
    }
  };

  window.closeModal = function() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', window.closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        window.closeModal();
      }
    });
  }

  // Bind trigger buttons for enquiry
  document.querySelectorAll('[data-open-enquiry]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product-name') || '';
      window.openEnquiryModal(product);
    });
  });

  // Footer Back to Top Button
  const footerBackToTop = document.getElementById('footer-back-to-top');
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // Header & Global Product Quick Search Controller
  // -------------------------------------------------------------------------
  (function initHeaderSearch() {
    let allProducts = [];
    let productsLoaded = false;
    let searchDebounce = null;

    function fetchProductsData() {
      if (productsLoaded) return Promise.resolve(allProducts);
      return fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
          allProducts = data || [];
          productsLoaded = true;
          return allProducts;
        })
        .catch(err => {
          console.warn('Could not fetch products for header search:', err);
          return [];
        });
    }

    // Pre-fetch products on idle
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => fetchProductsData());
    } else {
      setTimeout(fetchProductsData, 1000);
    }

    const normTerm = s => (s || '').toLowerCase().replace(/\bi\s*p\b/g, 'i p');

    function filterProducts(query) {
      const rawQuery = (query || '').trim();
      if (!rawQuery) return [];

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

      return allProducts.filter(item => {
        const itemText = normTerm(`${item.name} ${item.description || ''} ${item.grade || ''} ${item.cas || ''} ${item.applications || ''} ${item.category || ''}`);
        return consolidatedTokens.every(token => itemText.includes(token));
      });
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Attach search behavior to all header search instances
    const headerSearchWraps = document.querySelectorAll('.header-search-wrap');

    headerSearchWraps.forEach(wrap => {
      const form = wrap.querySelector('.header-search-form');
      const input = wrap.querySelector('.header-search-input');
      const clearBtn = wrap.querySelector('.header-search-clear');
      const dropdown = wrap.querySelector('.header-search-dropdown');
      const resultsContainer = wrap.querySelector('.header-search-results');
      const countEl = wrap.querySelector('.header-search-count');
      const viewAllLink = wrap.querySelector('.header-search-view-all');

      if (!input || !dropdown || !resultsContainer) return;

      function renderResults(matches, query) {
        const raw = (query || '').trim();
        if (!raw) {
          dropdown.style.display = 'none';
          if (clearBtn) clearBtn.style.display = 'none';
          return;
        }

        if (clearBtn) clearBtn.style.display = 'flex';

        if (countEl) {
          countEl.textContent = `${matches.length} Product${matches.length === 1 ? '' : 's'} Found`;
        }
        if (viewAllLink) {
          viewAllLink.href = `products.html?search=${encodeURIComponent(raw)}`;
        }

        if (matches.length === 0) {
          resultsContainer.innerHTML = `
            <div class="header-search-empty">
              <p>No products matching "<strong>${escapeHtml(raw)}</strong>"</p>
              <p style="font-size: 0.75rem; margin-top: 0.35rem; color: #94A3B8;">Press Enter to search full 46+ product catalogue.</p>
            </div>
          `;
        } else {
          const topList = matches.slice(0, 6);
          resultsContainer.innerHTML = topList.map(p => {
            const imgUrl = p.image || 'assets/images/products/bulk-api-powder.jpg';
            const gradeText = p.grade || 'Pharma Grade';
            return `
              <a href="product-detail.html?id=${encodeURIComponent(p.id)}" class="header-search-item" role="option">
                <img src="${imgUrl}" alt="${escapeHtml(p.name)}" class="header-search-item-thumb" onerror="this.src='assets/images/products/bulk-api-powder.jpg'">
                <div class="header-search-item-content">
                  <div class="header-search-item-title">${escapeHtml(p.name)}</div>
                  <div class="header-search-item-meta">
                    <span class="header-search-item-grade">${escapeHtml(gradeText)}</span>
                    ${p.cas ? `<span>CAS: ${escapeHtml(p.cas)}</span>` : ''}
                    <span>&bull;</span>
                    <span>${escapeHtml(p.category || 'Raw Material')}</span>
                  </div>
                </div>
                <div class="header-search-item-arrow">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </a>
            `;
          }).join('');
        }

        dropdown.style.display = 'block';
      }

      input.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        const query = e.target.value;
        searchDebounce = setTimeout(() => {
          fetchProductsData().then(() => {
            const matches = filterProducts(query);
            renderResults(matches, query);
          });
        }, 120);
      });

      input.addEventListener('focus', () => {
        if (input.value.trim()) {
          fetchProductsData().then(() => {
            const matches = filterProducts(input.value);
            renderResults(matches, input.value);
          });
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          input.value = '';
          dropdown.style.display = 'none';
          clearBtn.style.display = 'none';
          input.focus();
        });
      }

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdown.style.display = 'none';
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const firstItem = dropdown.querySelector('.header-search-item');
          if (firstItem) firstItem.focus();
        }
      });

      if (form) {
        form.addEventListener('submit', (e) => {
          const q = input.value.trim();
          if (!q) {
            e.preventDefault();
            window.location.href = 'products.html';
          }
        });
      }
    });

    // Close any open dropdown on click outside
    document.addEventListener('click', (e) => {
      headerSearchWraps.forEach(wrap => {
        const dropdown = wrap.querySelector('.header-search-dropdown');
        if (dropdown && !wrap.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });
    });

    // Mobile Search Bar Toggle
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    const mobileSearchBar = document.getElementById('mobile-search-bar');
    if (mobileSearchToggle && mobileSearchBar) {
      mobileSearchToggle.addEventListener('click', () => {
        const isShown = mobileSearchBar.style.display === 'block';
        mobileSearchBar.style.display = isShown ? 'none' : 'block';
        if (!isShown) {
          const mInput = mobileSearchBar.querySelector('.mobile-search-input');
          if (mInput) mInput.focus();
        }
      });
    }
  })();
});
