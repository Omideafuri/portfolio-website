/* ==========================================================================
   OMID MOHAMMADI PORTFOLIO — JAVASCRIPT V3
   Advanced Micro-interactions & Hardware Aesthetics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const CONFIG = {
    formEndpoint: 'https://api.web3forms.com/submit',
    defaultAccessKey: 'YOUR_ACCESS_KEY_HERE',
    directEmail: 'omideafuri@gmail.com'
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================================================
  // 01. NAVIGATION & SCROLL STATE
  // ========================================================================
  const systemBar = document.querySelector('.system-bar');
  const navToggle = document.querySelector('.system-bar__toggle');
  const navLinks = document.querySelector('.system-bar__links');
  const navLinkItems = document.querySelectorAll('.system-bar__link');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      systemBar.classList.add('system-bar--scrolled');
    } else {
      systemBar.classList.remove('system-bar--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

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
  // 02. SMOOTH SCROLL & SCROLLSPY
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

  const sections = document.querySelectorAll('section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const scrollSpyObserver = new IntersectionObserver((entries) => {
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
    }, { threshold: 0.15, rootMargin: '-64px 0px -40% 0px' });
    sections.forEach(section => scrollSpyObserver.observe(section));
  }

  // ========================================================================
  // 03. SCROLL REVEALS
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
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  // ========================================================================
  // 04. MAGNETIC BUTTONS (beUI / Rare UI style)
  // ========================================================================
  if (!prefersReducedMotion) {
    const magneticElements = document.querySelectorAll('.btn--primary, .btn--ghost');
    
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        
        // Very subtle translation (max 4px) to maintain precision hardware feel
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
      });
    });
  }

  // ========================================================================
  // 05. TILT CARDS & CURSOR GLARE
  // ========================================================================
  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set CSS variables for glare overlay position
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        // Calculate tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3; // Max 3deg rotation for hardware feel
        const rotateY = ((x - centerX) / centerX) * 3;
        
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        // Keep glare where it left off, but opacity handles hiding it in CSS
      });
    });
  }

  // ========================================================================
  // 06. LEAD FORM LOGIC
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => input.closest('.form-field')?.classList.remove('form-field--error'));
      input.addEventListener('change', () => input.closest('.form-field')?.classList.remove('form-field--error'));
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let hasError = false;
      const validateField = (input, condition) => {
        const field = input.closest('.form-field');
        if (!condition) { field.classList.add('form-field--error'); hasError = true; } 
        else { field.classList.remove('form-field--error'); }
      };

      validateField(document.getElementById('client-name'), document.getElementById('client-name').value.trim().length >= 2);
      validateField(document.getElementById('client-email'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('client-email').value.trim()));
      validateField(document.getElementById('project-desc'), document.getElementById('project-desc').value.trim().length >= 10);

      if (hasError) {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.textContent = 'Please complete all required fields.';
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>TRANSMITTING...</span> ⏳';

      try {
        await new Promise(res => setTimeout(res, 850)); // Simulated network
        if (formStatus) {
          formStatus.className = 'form-status form-status--success';
          formStatus.innerHTML = `<strong>INQUIRY RECEIVED.</strong><br>I will review and respond within 24 hours.`;
        }
        submitBtn.innerHTML = '<span>SUCCESS</span> ✓';
        contactForm.reset();
        setTimeout(() => { submitBtn.disabled = false; submitBtn.innerHTML = originalHTML; }, 5000);
      } catch (err) {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.innerHTML = `Error. Please email <a href="mailto:${CONFIG.directEmail}">${CONFIG.directEmail}</a> directly.`;
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }
});
