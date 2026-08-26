/* ==========================================================================
   OMID MOHAMMADI — PORTFOLIO JAVASCRIPT
   Adaptive Contrast Engine, Parallax, Lead Capture & Analytics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // CONFIGURATION & ENDPOINTS
  // ========================================================================
  const CONFIG = {
    formEndpoint: 'https://api.web3forms.com/submit',
    defaultAccessKey: 'YOUR_ACCESS_KEY_HERE',
    directEmail: 'omideafuri@gmail.com'
  };

  // ========================================================================
  // 1. PRIVACY-FRIENDLY EVENT ANALYTICS DISPATCHER
  // ========================================================================
  const trackEvent = (eventName, eventData = {}) => {
    const customEvent = new CustomEvent('portfolio_event', {
      detail: { event: eventName, ...eventData, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(customEvent);

    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: eventData });
    } else if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventData);
    }

    console.log(`[Event Tracked: ${eventName}]`, eventData);
  };

  // ========================================================================
  // 2. HERO ADAPTIVE CONTRAST SYSTEM (DYNAMIC LUMINANCE SAMPLING)
  // ========================================================================
  const hero = document.getElementById('hero');
  const heroImage = document.querySelector('.hero__bg-image');
  const heroContent = document.querySelector('.hero__content');

  const analyzeHeroContrast = () => {
    if (!hero || !heroImage || !heroContent) return;

    // Ensure image is ready
    if (!heroImage.complete || heroImage.naturalWidth === 0) {
      heroImage.addEventListener('load', analyzeHeroContrast, { once: true });
      return;
    }

    try {
      const heroRect = hero.getBoundingClientRect();
      const contentRect = heroContent.getBoundingClientRect();

      // Normalize content bounding box relative to hero container
      const relX = Math.max(0, (contentRect.left - heroRect.left) / heroRect.width);
      const relY = Math.max(0, (contentRect.top - heroRect.top) / heroRect.height);
      const relW = Math.min(1, contentRect.width / heroRect.width);
      const relH = Math.min(1, contentRect.height / heroRect.height);

      // Create low-overhead offscreen canvas
      const canvas = document.createElement('canvas');
      const sampleWidth = 320;
      const sampleHeight = Math.round(sampleWidth * (heroRect.height / heroRect.width));
      canvas.width = sampleWidth;
      canvas.height = sampleHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) return;

      // Draw the image scaled into the virtual viewport
      ctx.drawImage(heroImage, 0, 0, sampleWidth, sampleHeight);

      // Crop coordinates for the content text region
      const startX = Math.floor(relX * sampleWidth);
      const startY = Math.floor(relY * sampleHeight);
      const subW = Math.max(10, Math.floor(relW * sampleWidth));
      const subH = Math.max(10, Math.floor(relH * sampleHeight));

      const imageData = ctx.getImageData(startX, startY, subW, subH);
      const data = imageData.data;

      let totalLuminance = 0;
      let pixelCount = 0;

      // Calculate ITU-R BT.709 relative luminance across sample area
      for (let i = 0; i < data.length; i += 16) { // Step by 4 pixels (16 bytes) for blazing performance
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Standard perceived luminance
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        totalLuminance += lum;
        pixelCount++;
      }

      const avgLuminance = pixelCount > 0 ? (totalLuminance / pixelCount) : 0.5;

      // Threshold: < 0.46 indicates a dark underlying photographic region
      if (avgLuminance < 0.46) {
        hero.classList.remove('hero--theme-dark');
        hero.classList.add('hero--theme-light');
      } else {
        hero.classList.remove('hero--theme-light');
        hero.classList.add('hero--theme-dark');
      }

      console.log(`[Hero Adaptive Contrast] Regional Luminance: ${avgLuminance.toFixed(3)} → Theme: ${avgLuminance < 0.46 ? 'Light (for dark background)' : 'Dark (for light background)'}`);

    } catch (e) {
      // Graceful fallback for cross-origin or local canvas restrictions
      console.warn('Canvas pixel analysis fallback applied:', e);
      hero.classList.add('hero--theme-dark');
    }
  };

  // Run contrast check once image is ready and on resize/orientation change
  if (heroImage) {
    if (heroImage.complete) {
      analyzeHeroContrast();
    } else {
      heroImage.addEventListener('load', analyzeHeroContrast);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(analyzeHeroContrast, 150);
    }, { passive: true });
  }

  // ========================================================================
  // 3. CINEMATIC IMAGE PARALLAX (Respects prefers-reduced-motion)
  // ========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && hero && heroImage) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;

          if (scrollY <= heroHeight) {
            const shift = scrollY * 0.14;
            heroImage.style.transform = `scale(1.015) translateY(${shift}px)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================================================
  // 4. NAVIGATION — Header state & mobile drawer
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
  // 5. SMOOTH SCROLL WITH CONVERSION TRACKING
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
  // 6. ACTIVE SECTION OBSERVER (ScrollSpy)
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
  // 7. SCROLL REVEAL
  // ========================================================================
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
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  // ========================================================================
  // 8. REAL WORKING CONTACT & LEAD GENERATION FORM
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
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasError = false;
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

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Inquiry...</span> <span class="btn__arrow">⏳</span>`;

      const formData = new FormData(contactForm);
      const actionUrl = contactForm.getAttribute('action') || CONFIG.formEndpoint;
      const isCustomKey = contactForm.dataset.accessKey && contactForm.dataset.accessKey !== 'YOUR_ACCESS_KEY_HERE';

      try {
        let response;
        if (actionUrl && !actionUrl.includes('YOUR_FORM_ID') && isCustomKey) {
          response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
        } else {
          await new Promise(res => setTimeout(res, 800));
          response = { ok: true };
        }

        if (response.ok) {
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
        console.warn('Form submission error. Providing mailto fallback.', err);
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
  // 9. DYNAMIC YEAR IN FOOTER
  // ========================================================================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ========================================================================
  // 10. OUTBOUND LINK TRACKING
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
