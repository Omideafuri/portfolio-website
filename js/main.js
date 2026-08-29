/* ==========================================================================
   OMID MOHAMMADI PORTFOLIO — THE LIVING MACHINE MOTION SYSTEM (V4)
   Precision Physics, Coherent Ambient Layers, and Kinetic Typography
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================================================
  // 01. CORE ORCHESTRATION & SMOOTH SCROLL (LENIS + GSAP)
  // ========================================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  let lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1.2,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
  }

  // ========================================================================
  // 02. PHYSICS-BASED CUSTOM CURSOR SYSTEM
  // ========================================================================
  const cursor = document.getElementById('custom-cursor');
  if (cursor && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches && typeof gsap !== 'undefined') {
    
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power4.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power4.out" });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Cursor States
    const interactables = document.querySelectorAll('a, button, input, textarea, select, .tech-badge, .brand-mark');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('custom-cursor--hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--hover'));
    });

    const projects = document.querySelectorAll('.project-spread');
    projects.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.remove('custom-cursor--hover');
        cursor.classList.add('custom-cursor--project');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('custom-cursor--project');
      });
    });
  }

  // ========================================================================
  // 03. NAVIGATION & MAGNETIC MICRO-INTERACTIONS
  // ========================================================================
  const systemBar = document.querySelector('.system-bar');
  const navToggle = document.querySelector('.system-bar__toggle');
  const navLinks = document.querySelector('.system-bar__links');
  const navLinkItems = document.querySelectorAll('.system-bar__link');

  // Magnetic Pull on Buttons & Nav Links
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches && typeof gsap !== 'undefined') {
    const magneticElements = document.querySelectorAll('.btn, .system-bar__link, .brand-mark');
    
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        gsap.to(btn, { x: x, y: y, duration: 0.5, ease: 'power3.out' });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' });
      });
    });
  }

  // Navigation Scroll Blur Transition
  if (typeof ScrollTrigger !== 'undefined' && systemBar) {
    ScrollTrigger.create({
      start: 'top -40',
      onUpdate: (self) => {
        if (self.scroll() > 40) {
          systemBar.classList.add('system-bar--scrolled');
        } else {
          systemBar.classList.remove('system-bar--scrolled');
        }
      }
    });
  }

  // Mobile Drawer Toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('system-bar__links--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
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

  // Smooth Navigation Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(targetId, { offset: -70, duration: 0.8 });
      } else {
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========================================================================
  // 04. HERO SECTION 3D PARALLAX & ENTRANCE SEQUENCE
  // ========================================================================
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    const hero = document.querySelector('.hero');
    const headline = document.querySelector('.hero__headline');
    const subline = document.querySelector('.hero__subline');
    const bg = document.querySelector('.hero__bg');
    const overlay = document.querySelector('.hero__overlay');

    if (hero) {
      // 3D Parallax mapped to mouse coordinates
      hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        
        // Deep background moves inversely
        gsap.to(bg, { x: -x * 24, y: -y * 24, duration: 1.4, ease: 'power2.out' });
        // Colored glass overlay shifts
        gsap.to(overlay, { x: x * 35, y: y * 35, duration: 1.2, ease: 'power2.out' });
        // Typography moves forward with subtle 3D tilt
        gsap.to(headline, { x: x * 18, y: y * 18, rotationY: x * 4, rotationX: -y * 4, duration: 0.8, ease: 'power3.out' });
        gsap.to(subline, { x: x * 12, y: y * 12, duration: 1.0, ease: 'power3.out' });
      });

      hero.addEventListener('mouseleave', () => {
        gsap.to([bg, overlay, headline, subline], { 
          x: 0, y: 0, rotationY: 0, rotationX: 0, 
          duration: 1.8, ease: 'elastic.out(1, 0.4)' 
        });
      });

      // Choreographed Entrance Sequence
      const heroTl = gsap.timeline();
      heroTl.fromTo(headline, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out', delay: 0.05 }
      )
      .fromTo(subline,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        "-=0.4"
      )
      .fromTo('.hero__telemetry-tag, .hero__specs',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        "-=0.3"
      );
    }
  }

  // ========================================================================
  // 05. SCROLL-DRIVEN NARRATIVE & DIVIDER EXPANSION
  // ========================================================================
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    // Draw-in System Dividers
    const dividers = document.querySelectorAll('.sys-divider');
    dividers.forEach(divider => {
      gsap.fromTo(divider, 
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: divider,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // General Element Reveals
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      gsap.fromTo(el, 
        { y: 20, opacity: 0 },
        {
          y: 0, 
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Selected Work: Multi-layer Staggered Depth Parallax
    const projects = document.querySelectorAll('.project-spread');
    projects.forEach(card => {
      
      // Entrance reveal
      gsap.fromTo(card,
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Card hover 3D tilt + Differential element shift
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -2.5;
        const rotateY = ((x - centerX) / centerX) * 2.5;
        
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1200
        });

        // Shift inner visual container
        const visual = card.querySelector('.project-spread__visual > div, .project-spread__image');
        if (visual) {
          gsap.to(visual, {
            x: rotateY * 2.5,
            y: -rotateX * 2.5,
            duration: 0.4,
            ease: 'power2.out'
          });
        }

        // Shift badge and title at different depths
        const badge = card.querySelector('.project-spread__badge');
        const title = card.querySelector('.project-spread__title, h3');
        if (badge) gsap.to(badge, { x: rotateY * 1.5, y: -rotateX * 1.5, duration: 0.3 });
        if (title) gsap.to(title, { x: rotateY * 1.0, y: -rotateX * 1.0, duration: 0.3 });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
        const visual = card.querySelector('.project-spread__visual > div, .project-spread__image');
        const badge = card.querySelector('.project-spread__badge');
        const title = card.querySelector('.project-spread__title, h3');
        if (visual) gsap.to(visual, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
        if (badge) gsap.to(badge, { x: 0, y: 0, duration: 1.0 });
        if (title) gsap.to(title, { x: 0, y: 0, duration: 1.0 });
      });
    });

    // Credibility / Experience Plates Cascade
    const dataPlates = document.querySelectorAll('.data-plate');
    dataPlates.forEach(plate => {
      gsap.fromTo(plate,
        { y: 18, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: plate,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // ========================================================================
  // 06. INTERACTIVE CONTACT FORM FEEDBACK
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => input.closest('.form-field')?.classList.remove('form-field--error'));
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const descInput = document.getElementById('project-desc');
      let hasError = false;

      const validateField = (input, valid) => {
        const field = input.closest('.form-field');
        if (!valid) {
          field?.classList.add('form-field--error');
          hasError = true;
        } else {
          field?.classList.remove('form-field--error');
        }
      };

      validateField(nameInput, nameInput.value.trim().length >= 2);
      validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()));
      validateField(descInput, descInput.value.trim().length >= 8);

      if (hasError) {
        if (formStatus) {
          formStatus.className = 'form-status form-status--error';
          formStatus.textContent = 'Please fill out all required fields properly.';
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="font-mono text-meta">TRANSMITTING... ⏳</span>';

      try {
        await new Promise(res => setTimeout(res, 1000));
        if (formStatus) {
          formStatus.className = 'form-status form-status--success';
          formStatus.textContent = 'INQUIRY RECEIVED — I will review your project and get back to you within 24 hours.';
        }
        submitBtn.innerHTML = '<span class="font-mono text-meta" style="color: var(--signal-active);">SUCCESS ✓</span>';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }, 5000);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

});
