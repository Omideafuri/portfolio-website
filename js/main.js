/* ==========================================================================
   OMID MOHAMMADI — PORTFOLIO JAVASCRIPT
   Interactive Chapters, Parallax, Lead Acquisition & Analytics
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

  // ========================================================================
  // 02. PRIVACY-FRIENDLY EVENT DISPATCHER
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

    console.log(`[Publication Tracked: ${eventName}]`, eventData);
  };

  // ========================================================================
  // 03. NAVIGATION & SCROLL STATE
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
        trackEvent('mobile_nav_opened');
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
  // 04. SMOOTH SCROLL WITH OFFSET & CONVERSION HOOKS
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (anchor.classList.contains('btn') || anchor.classList.contains('nav__link')) {
          trackEvent('chapter_navigated', {
            target: targetId,
            label: anchor.innerText.trim()
          });
        }
      }
    });
  });

  // ========================================================================
  // 05. SCROLLSPY (ACTIVE CHAPTER OBSERVER)
  // ========================================================================
  const chapters = document.querySelectorAll('section[id]');
  if (chapters.length && 'IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
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
      threshold: 0.2,
      rootMargin: '-70px 0px -40% 0px'
    });

    chapters.forEach(chapter => chapterObserver.observe(chapter));
  }

  // ========================================================================
  // 06. INTERACTIVE CAPABILITY ITEMS
  // ========================================================================
  const capabilityItems = document.querySelectorAll('.capability-item');
  capabilityItems.forEach(item => {
    item.addEventListener('click', () => {
      capabilityItems.forEach(i => i.classList.remove('capability-item--active'));
      item.classList.add('capability-item--active');
      trackEvent('capability_selected', {
        title: item.querySelector('.capability-name')?.innerText.trim()
      });
    });
  });

  // ========================================================================
  // 07. EDITORIAL SCROLL REVEALS & PARALLAX
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
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  // Cinematic Parallax on Hero Visual
  const hero = document.getElementById('hero');
  const heroImage = document.querySelector('.hero__bg-image');

  if (!prefersReducedMotion && hero && heroImage) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;
          if (scrollY <= heroHeight) {
            heroImage.style.transform = `scale(1.02) translateY(${scrollY * 0.12}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================================================
  // 08. FUNCTIONAL LEAD ACQUISITION FORM
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
          formStatus.textContent = 'Please complete all required fields with valid details.';
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting Inquiry...</span> <span class="btn__arrow">⏳</span>`;

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
          // Simulation in local dev
          await new Promise(res => setTimeout(res, 850));
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

          submitBtn.innerHTML = `<span>Inquiry Received</span> <span class="btn__arrow">✓</span>`;
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
          throw new Error('Endpoint error');
        }

      } catch (err) {
        console.warn('Form network fallback triggered.', err);
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.innerHTML = `
            Could not deliver through online endpoint. You can email me directly at: 
            <a href="mailto:${CONFIG.directEmail}?subject=Project%20Inquiry%20from%20${encodeURIComponent(nameInput.value)}" style="color:var(--color-accent);text-decoration:underline;">
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
  // 09. OUTBOUND LINK TRACKING
  // ========================================================================
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('external_link_clicked', {
        href: link.href,
        text: link.innerText.trim()
      });
    });
  });

});
