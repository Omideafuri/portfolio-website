/* ==========================================================================
   OMID MOHAMMADI PORTFOLIO — JAVASCRIPT V2 (MODEL-22)
   Navigation, Telemetry, ScrollSpy, Reveals & Lead Acquisition
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 01. CONFIGURATION
  // ========================================================================
  const CONFIG = {
    formEndpoint: 'https://api.web3forms.com/submit',
    defaultAccessKey: 'YOUR_ACCESS_KEY_HERE',
    directEmail: 'omideafuri@gmail.com'
  };

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ========================================================================
  // 02. SYSTEM BAR SCROLL STATE & MOBILE DRAWER
  // ========================================================================
  const systemBar = document.querySelector('.system-bar');
  const navToggle = document.querySelector('.system-bar__toggle');
  const navLinks = document.querySelector('.system-bar__links');
  const navLinkItems = document.querySelectorAll('.system-bar__link');

  // Handle system bar elevation on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      systemBar.classList.add('system-bar--scrolled');
    } else {
      systemBar.classList.remove('system-bar--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile instrument drawer toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('system-bar__links--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));

      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('system-bar__links--open')) {
          navLinks.classList.remove('system-bar__links--open');
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
  // 03. SMOOTH NAVIGATION WITH OFFSET
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========================================================================
  // 04. SCROLLSPY — Active Navigation Indicator
  // ========================================================================
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && 'IntersectionObserver' in window) {
    const scrollSpyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinkItems.forEach(link => {
              link.classList.remove('system-bar__link--active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('system-bar__link--active');
              }
            });
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-56px 0px -40% 0px'
      }
    );

    sections.forEach(section => scrollSpyObserver.observe(section));
  }

  // ========================================================================
  // 05. SCROLL REVEALS (Mechanical Easing)
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -24px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  // ========================================================================
  // 06. LEAD ACQUISITION FORM (With Starting $700+ Validation)
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const parentField = input.closest('.form-field');
        if (parentField) {
          parentField.classList.remove('form-field--error');
        }
      });
      input.addEventListener('change', () => {
        const parentField = input.closest('.form-field');
        if (parentField) {
          parentField.classList.remove('form-field--error');
        }
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasError = false;
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const descInput = document.getElementById('project-desc');
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
      validateField(budgetInput, budgetInput.value !== '');
      validateField(descInput, descInput.value.trim().length >= 10);

      if (hasError) {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.textContent =
            'Please complete all required fields with valid project details.';
        }
        return;
      }

      // Submit State
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span>TRANSMITTING INQUIRY...</span> <span class="btn__arrow">⏳</span>';

      const formData = new FormData(contactForm);
      const actionUrl = contactForm.getAttribute('action') || CONFIG.formEndpoint;
      const isCustomKey =
        contactForm.dataset.accessKey &&
        contactForm.dataset.accessKey !== 'YOUR_ACCESS_KEY_HERE';

      try {
        let response;
        if (actionUrl && !actionUrl.includes('YOUR_FORM_ID') && isCustomKey) {
          response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' }
          });
        } else {
          // Simulation for local dev preview
          await new Promise(res => setTimeout(res, 850));
          response = { ok: true };
        }

        if (response.ok) {
          if (formStatus) {
            formStatus.className = 'form-status form-status--success';
            formStatus.innerHTML = `
              <strong>INQUIRY TRANSMITTED SUCCESSFULLY.</strong><br>
              Thank you, ${nameInput.value.trim()}. Your project specifications have been received. I will review and respond within 24–48 business hours.
            `;
          }

          submitBtn.innerHTML = '<span>INQUIRY RECEIVED</span> <span class="btn__arrow">✓</span>';
          contactForm.reset();

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }, 6000);
        } else {
          throw new Error('Endpoint error');
        }
      } catch (err) {
        console.warn('Form network fallback:', err);
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.innerHTML = `
            Could not deliver automatically. You can reach out directly via email at:
            <a href="mailto:${CONFIG.directEmail}?subject=Project%20Inquiry%20(Model%2022)"
               style="color:var(--signal-action);text-decoration:underline;">
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
  // 07. PRIVACY-FRIENDLY OUTBOUND EVENT DISPATCHER
  // ========================================================================
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', () => {
      const customEvent = new CustomEvent('portfolio_event', {
        detail: {
          event: 'external_link_clicked',
          href: link.href,
          text: link.innerText.trim(),
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(customEvent);
    });
  });

});
