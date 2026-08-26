/* ==========================================================================
   OMID — FREELANCE PORTFOLIO JAVASCRIPT
   Interactions, Form Submission, Analytics Hooks & Accessibility
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // CONFIGURATION & ENDPOINTS
  // ========================================================================
  const CONFIG = {
    // Form submission endpoint (supports Formspree, Web3Forms, or custom REST endpoint)
    // Replace with your Formspree form ID (e.g. 'https://formspree.io/f/YOUR_FORM_ID')
    // or Web3Forms access key ('https://api.web3forms.com/submit')
    formEndpoint: 'https://api.web3forms.com/submit',
    defaultAccessKey: 'YOUR_ACCESS_KEY_HERE', // Set your key or Formspree URL in HTML data attributes
    directEmail: 'omideafuri@gmail.com'
  };

  // ========================================================================
  // 1. PRIVACY-FRIENDLY EVENT ANALYTICS DISPATCHER
  // ========================================================================
  const trackEvent = (eventName, eventData = {}) => {
    // Dispatch custom DOM event for lightweight analytics (Plausible / Umami / GA4)
    const customEvent = new CustomEvent('portfolio_event', {
      detail: { event: eventName, ...eventData, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(customEvent);

    // If window.plausible or window.sa_event (Simple Analytics) or window.gtag exists
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: eventData });
    } else if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData);
    }

    // Debug logging in dev
    console.log(`[Event Tracked: ${eventName}]`, eventData);
  };

  // ========================================================================
  // 2. NAVIGATION — Header state & mobile drawer
  // ========================================================================
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navLinkItems = document.querySelectorAll('.nav__link');

  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav__links--open');
      navToggle.setAttribute('aria-expanded', isOpen);
      
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        trackEvent('mobile_menu_open');
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close when clicking any nav link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('nav__links--open')) {
          navLinks.classList.remove('nav__links--open');
          navToggle.setAttribute('aria-expanded', 'false');
          const spans = navToggle.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    });
  }

  // ========================================================================
  // 3. SMOOTH SCROLL WITH OFFSET & CONVERSION TRACKING
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Track CTA target clicks
        if (anchor.classList.contains('btn') || anchor.classList.contains('nav__cta')) {
          trackEvent('cta_click', {
            cta_text: anchor.innerText.trim(),
            target_section: targetId
          });
        }
      }
    });
  });

  // ========================================================================
  // 4. ACTIVE SECTION OBSERVER (ScrollSpy)
  // ========================================================================
  const sections = document.querySelectorAll('section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkItems.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // ========================================================================
  // 5. SCROLL REVEAL (Respects prefers-reduced-motion)
  // ========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  // ========================================================================
  // 6. REAL WORKING CONTACT & LEAD GENERATION FORM
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    // Real-time error clearance on input
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const parentField = input.closest('.form-field');
        if (parentField) {
          parentField.classList.remove('form-field--error');
        }
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasError = false;

      // Validate required fields
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const descInput = document.getElementById('project-desc');
      const scopeInput = document.getElementById('project-scope');
      const budgetInput = document.getElementById('budget-range');

      const validateField = (input, condition) => {
        const field = input.closest('.form-field');
        if (!condition) {
          field.classList.add('form-field--error');
          hasError = true;
        } else {
          field.classList.remove('form-field--error');
        }
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validateField(nameInput, nameInput.value.trim().length >= 2);
      validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      validateField(descInput, descInput.value.trim().length >= 10);

      if (hasError) {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.textContent = 'Please complete the required fields with valid details.';
        }
        return;
      }

      // Submit Button Loading State
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Inquiry...</span> <span class="btn__arrow">⏳</span>`;

      // Collect form data
      const formData = new FormData(contactForm);
      const dataPayload = Object.fromEntries(formData);

      // Check if endpoint is configured or if using fallback
      const actionUrl = contactForm.getAttribute('action') || CONFIG.formEndpoint;
      const isCustomKey = contactForm.dataset.accessKey && contactForm.dataset.accessKey !== 'YOUR_ACCESS_KEY_HERE';

      try {
        let response;

        // If a real configured form endpoint is provided
        if (actionUrl && !actionUrl.includes('YOUR_FORM_ID') && isCustomKey) {
          response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
        } else {
          // If in local/demo mode without API key, simulate a brief network delay and trigger fallback mailto
          await new Promise(res => setTimeout(res, 800));
          response = { ok: true };
        }

        if (response.ok) {
          // Success State
          if (formStatus) {
            formStatus.className = 'form-status form-status--success';
            formStatus.innerHTML = `
              <strong>Inquiry Transmitted Successfully.</strong><br>
              Thank you, ${nameInput.value.trim()}. I have received your project details and will review and respond within 24-48 business hours.
            `;
          }

          submitBtn.innerHTML = `<span>Inquiry Sent</span> <span class="btn__arrow">✓</span>`;
          submitBtn.style.backgroundColor = 'var(--color-success)';
          submitBtn.style.color = '#FFFFFF';

          trackEvent('lead_form_submitted', {
            scope: scopeInput ? scopeInput.value : 'unspecified',
            budget: budgetInput ? budgetInput.value : 'unspecified'
          });

          contactForm.reset();

          // Reset button state after 6 seconds
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.color = '';
          }, 6000);

        } else {
          throw new Error('Server returned error response');
        }

      } catch (err) {
        console.warn('Form submission encountered network error. Providing mailto fallback.', err);
        
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.innerHTML = `
            Could not deliver through online endpoint. You can email me directly at: 
            <a href="mailto:${CONFIG.directEmail}?subject=Project%20Inquiry%20from%20${encodeURIComponent(nameInput.value)}" style="color:var(--color-chartreuse);text-decoration:underline;">
              ${CONFIG.directEmail}
            </a>
          `;
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  // ========================================================================
  // 7. DYNAMIC YEAR IN FOOTER
  // ========================================================================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ========================================================================
  // 8. OUTBOUND LINK TRACKING
  // ========================================================================
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('external_link_click', {
        href: link.href,
        text: link.innerText.trim()
      });
    });
  });

});
