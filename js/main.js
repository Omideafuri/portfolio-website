/* ==========================================================================
   MAIN.JS — Portfolio Interactions & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. NAVIGATION — Scroll shadow & mobile toggle
  // ========================================================================
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navLinkItems = document.querySelectorAll('.nav__link');

  // Add shadow on scroll
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav__links--open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('nav__links--open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Close mobile menu on link click
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('nav__links--open')) {
        navLinks.classList.remove('nav__links--open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });

  // ========================================================================
  // 2. SMOOTH SCROLL for anchor links
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========================================================================
  // 3. INTERSECTION OBSERVER — Scroll reveal animations
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach(el => el.classList.add('reveal--visible'));
  }

  // ========================================================================
  // 4. PORTFOLIO FILTER TABS
  // ========================================================================
  const filterBtns = document.querySelectorAll('.portfolio__filter');
  const caseCards = document.querySelectorAll('.case-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      filterBtns.forEach(b => b.classList.remove('portfolio__filter--active'));
      btn.classList.add('portfolio__filter--active');

      const filter = btn.dataset.filter;

      caseCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================================================
  // 5. FORM HANDLING
  // ========================================================================
  const intakeForm = document.querySelector('.intake-form');

  if (intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(intakeForm);
      const data = Object.fromEntries(formData);

      // Visual feedback
      const submitBtn = intakeForm.querySelector('.btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Application Received</span> <span class="btn__arrow">✓</span>`;
      submitBtn.style.background = 'rgba(200, 217, 43, 0.3)';
      submitBtn.style.borderColor = 'var(--color-chartreuse)';
      submitBtn.disabled = true;

      // Reset after 4 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
        intakeForm.reset();
      }, 4000);

      console.log('Form submitted:', data);
    });
  }

  // ========================================================================
  // 6. PARALLAX — Subtle hero atmosphere movement
  // ========================================================================
  const heroAtmosphere = document.querySelector('.hero__atmosphere');

  if (heroAtmosphere && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const rate = scrollY * 0.3;
          heroAtmosphere.style.transform = `translateY(${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================================================
  // 7. ACTIVE NAV LINK TRACKING
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
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // ========================================================================
  // 8. YEAR in footer
  // ========================================================================
  const yearEl = document.querySelector('.footer__year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
