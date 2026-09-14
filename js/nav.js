function closeMobileMenu() {
  const menu = document.getElementById('mobile-nav-menu');
  if (menu) {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
  }
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  }
  document.body.classList.remove('nav-menu-open');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-nav-menu');
  if (!menu || !hamburger) return;
  const opening = !menu.classList.contains('open');

  if (opening) {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-menu-open');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.mobile-nav-link',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  } else {
    closeMobileMenu();
  }
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMobileMenu();
    }
  });
}

// Close mobile navigation drawer whenever a link inside it is tapped
document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

function updateScrollUi(e) {
  if (mainNav) {
    const currentScroll = (e && typeof e.animatedScroll === 'number') ? e.animatedScroll : window.scrollY;
    if (currentScroll > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }
}

if (typeof lenis !== 'undefined') {
  lenis.on('scroll', updateScrollUi);
} else {
  window.addEventListener('scroll', updateScrollUi, { passive: true });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

  if (prefersReducedMotion) {
    gsap.set('[data-reveal], .reveal, .featured-card, .work-card, .cert-card, .coding-badge-card, .footer-giant-wordmark, .footer-intro-block, .footer-nav-col, .footer-meta-row', {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clearProps: 'transform'
    });
  } else {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      if (el.closest('.work-grid') || el.closest('.certs-grid') || el.closest('#contact')) return;

      const direction = el.dataset.reveal;
      const fromVars = { opacity: 0 };

    if (direction === 'left') fromVars.x = -48;
    else if (direction === 'right') fromVars.x = 48;
    else if (direction === 'scale') fromVars.scale = 0.92;
    else fromVars.y = 48;

    gsap.fromTo(
      el,
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    gsap.to('.cloud-left', {
      y: isMobile ? -55 : -110,
      x: isMobile ? -20 : -45,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    gsap.to('.cloud-right', {
      y: isMobile ? -50 : -100,
      x: isMobile ? 20 : 45,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    gsap.to('.projects-bg, .next-section-bg', {
      y: isMobile ? -30 : -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.projects-section, .next-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    gsap.to('.projects-atmosphere, .next-section-atmosphere', {
      y: isMobile ? -20 : -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.projects-section, .next-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8
      }
    });
  }

  document.querySelectorAll('.featured-card').forEach((card) => {
    const visual = card.querySelector('.featured-image-frame');
    const content = card.querySelector('.featured-card-content');

    if (visual) {
      gsap.fromTo(visual,
        { opacity: 0, scale: 0.96, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });

  gsap.fromTo('.other-projects-section .work-card',
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.other-projects-section',
        start: 'top 85%',
      },
    }
  );

  gsap.fromTo('.certs-grid .cert-card',
    { opacity: 0, y: 24, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.certs-grid',
        start: 'top 85%',
      },
    }
  );

  gsap.fromTo('.coding-achievements-strip .coding-badge-card',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.coding-achievements-wrap',
        start: 'top 88%',
      },
    }
  );

  if (!prefersReduced && !document.body.classList.contains('lite-mode')) {
    const certSection = document.getElementById('certs');
    const primaryCert = document.querySelector('.cert-card--primary');
    if (certSection && primaryCert) {
      let certRect = null;
      const qRotY = gsap.quickTo(primaryCert, "rotationY", { duration: 0.6, ease: "power1.out" });
      const qRotX = gsap.quickTo(primaryCert, "rotationX", { duration: 0.6, ease: "power1.out" });

      certSection.addEventListener('mouseenter', () => {
        certRect = primaryCert.getBoundingClientRect();
      }, { passive: true });

      certSection.addEventListener('mousemove', (e) => {
        if (!certRect) certRect = primaryCert.getBoundingClientRect();
        const halfW = certRect.width / 2;
        const halfH = certRect.height / 2;
        if (!halfW || !halfH) return;
        const x = (e.clientX - (certRect.left + halfW)) / halfW;
        const y = (e.clientY - (certRect.top + halfH)) / halfH;
        if (Math.abs(x) < 2.5 && Math.abs(y) < 2.5) {
          qRotY(Math.max(-3.5, Math.min(3.5, x * 2.5)));
          qRotX(Math.max(-3.5, Math.min(3.5, -y * 2.5)));
        }
      }, { passive: true });

      certSection.addEventListener('mouseleave', () => {
        certRect = null;
        gsap.to(primaryCert, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.75,
          ease: 'power2.out'
        });
      });
    }
  }

  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
  });

  contactTl
    .fromTo('#contact .contact-eyebrow',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }
    )
    .fromTo('#contact .cta-word--1',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45'
    )
    .fromTo('#contact .cta-word--2',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55'
    )
    .fromTo('#contact .cta-word--3',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55'
    )
    .fromTo('#contact .contact-lead',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4'
    )
    .fromTo('#contact .contact-info-item',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, '-=0.4'
    )
    .fromTo('#contact .contact-form-card',
      { opacity: 0, y: 36, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6'
    );

  if (!prefersReduced) {
    gsap.to('.contact-fog-img', {
      y: -50,
      x: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    const footerTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-footer-bar',
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      }
    });

    footerTl
      .fromTo('.footer-intro-block',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.footer-nav-col',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' }, '-=0.55'
      )
      .fromTo('.footer-brand-stage',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4'
      )
      .fromTo('.footer-meta-row',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.4'
      );

    gsap.fromTo('.footer-giant-wordmark',
      {
        yPercent: 78,
        opacity: 0.2,
        scale: 0.96
      },
      {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact-footer-bar',
          start: 'top 95%',
          end: 'bottom bottom',
          scrub: 1.3,
          invalidateOnRefresh: true
        }
      }
    );

    gsap.fromTo('.footer-top-grid',
      { y: 32 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact-footer-bar',
          start: 'top 95%',
          end: 'center bottom',
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      }
    );

    const footerEl = document.querySelector('.contact-footer-bar');
    const wordmarkEl = document.querySelector('.footer-giant-wordmark');
    const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
    if (footerEl && wordmarkEl && !isMobileDevice && !document.body.classList.contains('lite-mode')) {
      let footerRect = null;
      const qX = gsap.quickTo(wordmarkEl, "x", { duration: 0.8, ease: "power2.out" });
      const qY = gsap.quickTo(wordmarkEl, "y", { duration: 0.8, ease: "power2.out" });

      footerEl.addEventListener('mouseenter', () => {
        footerRect = footerEl.getBoundingClientRect();
      }, { passive: true });

      footerEl.addEventListener('mousemove', (e) => {
        if (!footerRect) footerRect = footerEl.getBoundingClientRect();
        if (!footerRect.width || !footerRect.height) return;
        const xNorm = (e.clientX - footerRect.left) / footerRect.width - 0.5;
        const yNorm = (e.clientY - footerRect.top) / footerRect.height - 0.5;
        qX(xNorm * 34);
        qY(yNorm * 10);
      }, { passive: true });

      footerEl.addEventListener('mouseleave', () => {
        footerRect = null;
        gsap.to(wordmarkEl, {
          x: 0,
          y: 0,
          duration: 1.0,
          ease: 'power2.out'
        });
      });
    }
  }

  if (!prefersReduced) {
    gsap.fromTo('.capability-row',
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.capability-index',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.edu-item',
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.education-editorial-list',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.ach-editorial-card',
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.achievements-editorial-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

} else {
  const revealEls = document.querySelectorAll('[data-reveal], .reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ── BACK TO TOP BUTTON ── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const circle = btn.querySelector('.progress-ring__circle');
  const radius = circle ? parseFloat(circle.getAttribute('r')) : 21;
  const circumference = 2 * Math.PI * radius; // ~132

  if (circle) {
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
  }

  function updateBtn() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // Show/hide button after 400px
    if (scrollTop > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }

    // Update ring progress
    if (circle) {
      circle.style.strokeDashoffset = circumference * (1 - progress);
    }
  }

  window.addEventListener('scroll', updateBtn, { passive: true });
  if (typeof lenis !== 'undefined') {
    lenis.on('scroll', updateBtn);
  }

  btn.addEventListener('click', () => {
    if (typeof lenis !== 'undefined') {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
