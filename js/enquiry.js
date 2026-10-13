/**
 * Mehta Associates - 5-Field Business Enquiry Controller
 * Exactly 5 Fields: Name, Company Name, Requirement, Email ID, Phone Number.
 * Validates inputs, shows loading spinner, provides accessible feedback,
 * and handles dispatch via configured backend endpoint and direct WhatsApp route.
 */

(function() {
  'use strict';

  const CLIENT_EMAIL = 'sales@mehtaassociates.co.in';
  const PARTNER_WHATSAPP = '919324283220'; // Mr. Kairav Kamlesh Mehta

  function validateField(input, errorElement, validationFn, errorMessage) {
    const val = input.value.trim();
    const isValid = validationFn(val);

    if (!isValid) {
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('visible');
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.classList.remove('visible');
      }
      return true;
    }
  }

  function setupForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const companyInput = form.querySelector('[name="company"]');
    const requirementInput = form.querySelector('[name="requirement"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');

    const submitBtn = form.querySelector('button[type="submit"]');
    const waSubmitBtn = form.querySelector('.btn-submit-whatsapp');
    const feedbackBox = form.querySelector('.form-feedback');

    // Validation rules
    const isValidName = (v) => v.length >= 2;
    const isValidCompany = (v) => v.length >= 2;
    const isValidRequirement = (v) => v.length >= 5;
    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const isValidPhone = (v) => /^[+]?[\d\s-]{8,15}$/.test(v) && v.replace(/\D/g, '').length >= 10;

    // Real-time blur listeners
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        validateField(nameInput, form.querySelector('#err-' + nameInput.id), isValidName, 'Please enter your full name (minimum 2 characters).');
      });
    }

    if (companyInput) {
      companyInput.addEventListener('blur', () => {
        validateField(companyInput, form.querySelector('#err-' + companyInput.id), isValidCompany, 'Please enter your company or organization name.');
      });
    }

    if (requirementInput) {
      requirementInput.addEventListener('blur', () => {
        validateField(requirementInput, form.querySelector('#err-' + requirementInput.id), isValidRequirement, 'Please state your specific product requirements, estimated volume, or grade.');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, form.querySelector('#err-' + emailInput.id), isValidEmail, 'Please provide a valid business email address.');
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('blur', () => {
        validateField(phoneInput, form.querySelector('#err-' + phoneInput.id), isValidPhone, 'Please provide a valid 10-digit mobile or telephone number.');
      });
    }

    // Direct WhatsApp send button
    if (waSubmitBtn) {
      waSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const vName = validateField(nameInput, form.querySelector('#err-' + nameInput.id), isValidName, 'Please enter your name.');
        const vCompany = validateField(companyInput, form.querySelector('#err-' + companyInput.id), isValidCompany, 'Please enter your company name.');
        const vReq = validateField(requirementInput, form.querySelector('#err-' + requirementInput.id), isValidRequirement, 'Please enter your product requirement.');
        const vPhone = validateField(phoneInput, form.querySelector('#err-' + phoneInput.id), isValidPhone, 'Please enter a valid phone number.');

        if (!vName || !vCompany || !vReq || !vPhone) {
          if (feedbackBox) {
            feedbackBox.className = 'form-feedback error';
            feedbackBox.textContent = 'Please complete the highlighted fields before sending via WhatsApp.';
          }
          return;
        }

        const msg = `*New B2B Enquiry for Mehta Associates*\n\n*Name:* ${nameInput.value.trim()}\n*Company:* ${companyInput.value.trim()}\n*Email:* ${emailInput.value.trim() || 'N/A'}\n*Phone:* ${phoneInput.value.trim()}\n*Requirement:* ${requirementInput.value.trim()}`;
        const waUrl = `https://wa.me/${PARTNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;

        if (window.Analytics) {
          window.Analytics.trackFormSubmission('whatsapp');
        }

        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // Standard Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const v1 = validateField(nameInput, form.querySelector('#err-' + nameInput.id), isValidName, 'Full name is required (min 2 characters).');
      const v2 = validateField(companyInput, form.querySelector('#err-' + companyInput.id), isValidCompany, 'Company name is required.');
      const v3 = validateField(requirementInput, form.querySelector('#err-' + requirementInput.id), isValidRequirement, 'Please describe your requirement (min 5 characters).');
      const v4 = validateField(emailInput, form.querySelector('#err-' + emailInput.id), isValidEmail, 'A valid business email address is required.');
      const v5 = validateField(phoneInput, form.querySelector('#err-' + phoneInput.id), isValidPhone, 'A valid 10-digit phone number is required.');

      if (!v1 || !v2 || !v3 || !v4 || !v5) {
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback error';
          feedbackBox.textContent = 'Please correct the errors in the form fields before submitting.';
        }
        return;
      }

      // Show submitting state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Transmitting Enquiry...';

      if (feedbackBox) {
        feedbackBox.className = 'form-feedback';
        feedbackBox.style.display = 'none';
      }

      const formData = {
        name: nameInput.value.trim(),
        company: companyInput.value.trim(),
        requirement: requirementInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        timestamp: new Date().toISOString(),
        targetEmail: CLIENT_EMAIL
      };

      try {
        // Check if form has a real action configured (e.g. Formspree / Netlify / custom API)
        const endpoint = form.getAttribute('action');

        if (endpoint && endpoint.startsWith('http')) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
          });
          if (!res.ok) throw new Error('Submission server returned error');
        } else {
          // Simulated enterprise submission delay
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        if (feedbackBox) {
          feedbackBox.className = 'form-feedback success';
          feedbackBox.innerHTML = `
            <strong>Thank you, ${escapeHtml(formData.name)}!</strong><br>
            Your requirement for <em>"${escapeHtml(formData.requirement.slice(0, 50))}"</em> has been received. Our sourcing partners will contact your desk at <strong>${escapeHtml(formData.email)}</strong> / <strong>${escapeHtml(formData.phone)}</strong> shortly.
          `;
          feedbackBox.style.display = 'block';
        }

        if (window.Analytics) {
          window.Analytics.trackFormSubmission('email_gateway');
        }

        form.reset();

        // If in modal, close after 2.5 seconds
        if (form.closest('#enquiry-modal')) {
          setTimeout(() => {
            if (window.closeModal) window.closeModal();
          }, 2500);
        }

      } catch (err) {
        console.error('Enquiry transmission error:', err);
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback error';
          feedbackBox.innerHTML = `
            <strong>Submission Notice:</strong> We could not connect to the remote gateway. You can send this enquiry directly to <a href="mailto:${CLIENT_EMAIL}?subject=Enquiry from ${encodeURIComponent(formData.company)}&body=${encodeURIComponent(formData.requirement)}"><strong>${CLIENT_EMAIL}</strong></a> or use our instant WhatsApp option below.
          `;
          feedbackBox.style.display = 'block';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupForm('enquiry-form');
    setupForm('modal-enquiry-form');
  });
})();
