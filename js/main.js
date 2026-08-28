/* ==========================================================================
   OMID MOHAMMADI PORTFOLIO — THE LIVING MACHINE (MOTION V4)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================================================
  // 01. CORE DEPENDENCIES & SETUP
  // ========================================================================
  gsap.registerPlugin(ScrollTrigger);

  let lenis;
  let scrollVelocity = 0;

  if (!prefersReducedMotion) {
    // Initialize Lenis
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like ease
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      scrollVelocity = e.velocity;
      
      // Meso/Macro ambient system: Velocity affects background glow intensity
      const ambientGlow = document.querySelector('.hero__overlay');
      if (ambientGlow) {
        const intensity = Math.min(Math.abs(scrollVelocity) * 0.05, 0.3);
        gsap.to(ambientGlow, {
          opacity: 1 + intensity,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
  }

  // ========================================================================
  // 02. CUSTOM CURSOR SYSTEM (PHYSICS-BASED)
  // ========================================================================
  const cursor = document.getElementById('custom-cursor');
  if (cursor && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    
    // GSAP quickTo for high-performance physics interpolation
    const xTo = gsap.quickTo(cursor, "x", {duration: 0.6, ease: "power4.out"});
    const yTo = gsap.quickTo(cursor, "y", {duration: 0.6, ease: "power4.out"});

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Cursor States
    const interactables = document.querySelectorAll('a, button, input, textarea, select');
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
  // 03. NAVIGATION & MAGNETIC BUTTONS
  // ========================================================================
  const systemBar = document.querySelector('.system-bar');
  
  // Magnetic Buttons (Mesoscale Interaction)
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magneticElements = document.querySelectorAll('.btn--primary, .btn--ghost, .system-bar__link');
    
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        gsap.to(btn, { x: x, y: y, duration: 0.6, ease: 'power3.out' });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  // Navigation Scroll State
  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
      if (self.scroll() > 50) {
        systemBar.classList.add('system-bar--scrolled');
      } else {
        systemBar.classList.remove('system-bar--scrolled');
      }
    }
  });

  // Smooth Scroll Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(targetId, { offset: -80, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========================================================================
  // 04. HERO ENVIRONMENT (MACRO & MICRO)
  // ========================================================================
  if (!prefersReducedMotion) {
    const hero = document.querySelector('.hero');
    const headline = document.querySelector('.hero__headline');
    const subline = document.querySelector('.hero__subline');
    const bg = document.querySelector('.hero__bg');
    const overlay = document.querySelector('.hero__overlay');

    if (hero) {
      // 3D Parallax mapped to cursor
      hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        
        // Background moves opposite
        gsap.to(bg, { x: -x * 30, y: -y * 30, duration: 1.5, ease: 'power2.out' });
        // Overlay (light) moves slightly with cursor
        gsap.to(overlay, { x: x * 40, y: y * 40, duration: 1.2, ease: 'power2.out' });
        // Typography moves strongly with cursor
        gsap.to(headline, { x: x * 20, y: y * 20, rotationY: x * 5, rotationX: -y * 5, duration: 0.8, ease: 'power3.out' });
        gsap.to(subline, { x: x * 15, y: y * 15, duration: 1, ease: 'power3.out' });
      });

      hero.addEventListener('mouseleave', () => {
        gsap.to([bg, overlay, headline, subline], { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 2, ease: 'elastic.out(1, 0.4)' });
      });

      // Initial Entrance Animation
      const tl = gsap.timeline();
      tl.fromTo(headline, 
        { y: 60, opacity: 0, rotationX: 20 }, 
        { y: 0, opacity: 1, rotationX: 0, duration: 1.6, ease: 'power4.out', delay: 0.2 }
      )
      .fromTo(subline,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        "-=1.2"
      )
      .fromTo('.hero__telemetry-tag, .hero__specs',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' },
        "-=1"
      );
    }
  }

  // ========================================================================
  // 05. SCROLL REVEALS & CONTINUITY
  // ========================================================================
  if (!prefersReducedMotion) {
    
    // Standard reveals
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      // Remove the old CSS classes if they exist, let GSAP handle it
      el.classList.remove('reveal');
      
      gsap.fromTo(el, 
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Project Spreads (Persian Glass Glow tracking + Parallax)
    const projects = document.querySelectorAll('.project-spread');
    projects.forEach(card => {
      
      // Entrance parallax
      gsap.fromTo(card.querySelector('.project-spread__visual'),
        { y: 50, scale: 0.95 },
        {
          y: 0, scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            scrub: 0.5
          }
        }
      );

      // Interactive hover
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt
        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;
        
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });

        // Image shift (parallax inside card)
        const visual = card.querySelector('.project-spread__visual > div');
        if (visual) {
          gsap.to(visual, {
            x: rotateY * 2,
            y: -rotateX * 2,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 1.5, ease: 'elastic.out(1, 0.4)' });
        const visual = card.querySelector('.project-spread__visual > div');
        if (visual) {
          gsap.to(visual, { x: 0, y: 0, duration: 1.5, ease: 'elastic.out(1, 0.4)' });
        }
      });
    });
  }

  // ========================================================================
  // 06. CONTACT FORM LOGIC (Minimalist)
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="font-mono text-meta">INITIALIZING...</span>';

      try {
        await new Promise(res => setTimeout(res, 1200)); 
        submitBtn.innerHTML = '<span class="font-mono text-meta" style="color: var(--signal-active);">TRANSMITTED ✓</span>';
        contactForm.reset();
        setTimeout(() => { submitBtn.disabled = false; submitBtn.innerHTML = originalHTML; }, 4000);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

});
