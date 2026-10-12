/**
 * Mehta Associates - Analytics Event Tracking Module
 * Supports Google Analytics 4 (gtag.js) with graceful console/local telemetry.
 * Does not fabricate public statistics or misuse localStorage for visitor counts.
 */

const Analytics = (function() {
  'use strict';

  // Configurable GA4 Measurement ID (to be provided by client upon deployment)
  const GA_MEASUREMENT_ID = window.MEHTA_GA_ID || null;

  function init() {
    // Check if gtag is defined on window
    if (window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  /**
   * Generic event logger
   * @param {string} eventName
   * @param {object} params
   */
  function trackEvent(eventName, params = {}) {
    const payload = {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      ...params
    };

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    } else {
      // Safe development/debug logger
      // console.debug(`[Analytics] ${eventName}:`, payload);
    }
  }

  return {
    init,
    trackEvent,
    // Pre-bound specific tracking functions
    trackPageView: (pageName) => {
      trackEvent('page_view', { page_title: pageName });
    },
    trackProductSearch: (query, resultCount) => {
      trackEvent('product_search', { search_term: query, results_count: resultCount });
    },
    trackProductEnquiryClick: (productName, channel = 'form') => {
      trackEvent('product_enquiry_click', { product_name: productName, channel });
    },
    trackWhatsAppClick: (partnerName, context = 'floating') => {
      trackEvent('whatsapp_click', { partner: partnerName, context });
    },
    trackBrochureView: () => {
      trackEvent('brochure_view', { file: 'company-brochure.pdf' });
    },
    trackBrochureDownload: () => {
      trackEvent('brochure_download', { file: 'company-brochure.pdf' });
    },
    trackFormSubmission: (channel = 'web') => {
      trackEvent('enquiry_form_submission', { channel });
    }
  };
})();

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
  Analytics.init();
});
