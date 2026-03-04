const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mainNav = document.getElementById('main-nav');
const navLinksWrap = document.querySelector('.nav-links');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const hamburger = document.getElementById('hamburger');
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const delay = prefersReducedMotion ? 220 : 950;
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.remove();
      }
    }, 900);
  }, delay);
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  // Delay decorative effects
  setTimeout(() => {
    document.body.classList.add("effects-ready");
  }, 100);
});

const isLowEndDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory && navigator.deviceMemory < 4);

if (isLowEndDevice || window.innerWidth < 768) {
  document.body.classList.add("lite-mode");
}

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.6, // Increased for a slower, more deliberate glide
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Standard ease-out
  smoothWheel: true,
  touchMultiplier: 1.5, // Reduced slightly to avoid overly jittery tracking on mobile
  lerp: 0.05, // Lowered for stronger interpolation (more "butter")
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ── Hero & Global Parallax ──
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.utils.toArray('[data-speed]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed')) || 1;
    // Calculate how much the element should move based on its speed multiplier
    // A speed of 1 means it moves normally with the scroll.
    // > 1 moves faster, < 1 moves slower (parallax depth).
    const yOffset = (1 - speed) * 100 * 3; // Adjust multiplier for strength

    gsap.to(el, {
      y: yOffset,
      ease: 'none',
      scrollTrigger: {
        trigger: el, // Only track when the actual element is on screen!
        start: 'top bottom', // Start computing math when it enters the viewport
        end: 'bottom top',   // Stop computing math the moment it scrolls away
        scrub: 0.1, // Smooth dragging effect
      }
    });
  });

  // 1. Headline Micro Depth
  gsap.to(".hero-headline-wrap", {
    y: -60,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.5
    }
  });

  // 2. Section Transition Flow
  gsap.utils.toArray("section").forEach(sec => {
    // Avoid re-animating the hero section since it's the landing piece
    // Also skip work and certs since they have their own complex inner staggers
    if (sec.id === 'hero' || sec.id === 'work' || sec.id === 'certs') return;

    gsap.from(sec, {
      opacity: 0, // Fade from 0, to 0.95 or 1 gracefully via CSS
      y: 40,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 85%"
      }
    });
  });
}

function closeMobileMenu() {
  if (!navLinksWrap || !hamburger) return;
  navLinksWrap.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.querySelectorAll('span').forEach((s) => {
    s.style.transform = '';
    s.style.opacity = '';
  });
}

function toggleMobileMenu() {
  if (!navLinksWrap || !hamburger) return;
  const opening = !navLinksWrap.classList.contains('open');
  navLinksWrap.classList.toggle('open', opening);
  hamburger.classList.toggle('open', opening);
  hamburger.setAttribute('aria-expanded', opening ? 'true' : 'false');

  const spans = hamburger.querySelectorAll('span');
  if (opening) {
    spans[0].style.transform = 'translateY(6px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.nav-links a',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      );
    }
  } else {
    spans.forEach((s) => {
      s.style.transform = '';
      s.style.opacity = '';
    });
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

window.addEventListener('scroll', updateScrollUi, { passive: true });
if (typeof lenis !== 'undefined') {
  lenis.on('scroll', updateScrollUi);
}

// ═══════════════════════════════════════════════════════
//  SCROLL REVEAL SYSTEM — data-reveal attribute based
//  (Following ScrollReveal_Using_GSAP_ScrollTrigger_Guide)
// ═══════════════════════════════════════════════════════

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

  // ── 1. Direction-Based Individual Reveals ──
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    // Skip elements being handled by group stagger timelines to prevent double-animation
    if (el.closest('.work-grid') || el.closest('.certs-grid') || el.closest('#contact') || el.closest('#resume-card')) return;

    const direction = el.dataset.reveal;
    const fromVars = { opacity: 0 };

    if (direction === 'left') fromVars.x = -48;
    else if (direction === 'right') fromVars.x = 48;
    else if (direction === 'scale') fromVars.scale = 0.92;
    else fromVars.y = 48; // default: slide up

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

  // ── 2. Staggered Group Reveal: Work Cards ──
  gsap.fromTo('.work-card',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.work-grid',
        start: 'top 85%',
      },
    }
  );

  // ── 3. Staggered Group Reveal: Certificate Cards ──
  gsap.fromTo('.cert-card',
    { opacity: 0, scale: 0.92 },
    {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: '.certs-grid',
        start: 'top 85%',
      },
    }
  );

  // ── 4. Scroll-Linked Timeline: Contact Section ──
  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
    },
  });

  contactTl
    .fromTo('#contact .contact-left',
      { opacity: 0, x: -48 },
      { opacity: 1, x: 0, duration: 1.5 }
    )
    .fromTo('#contact .contact-right',
      { opacity: 0, x: 48 },
      { opacity: 1, x: 0, duration: 1.5 }, '-=1'
    );

  // ── 5. Resume Card Columns Reveal ──
  gsap.fromTo('.resume-left-col',
    { opacity: 0, x: -48 },
    {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#resume-card',
        start: 'top 85%',
      },
    }
  );

  gsap.fromTo('.edu-exp-col',
    { opacity: 0, y: 48 },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: '#resume-card',
        start: 'top 85%',
      },
    }
  );

  gsap.fromTo('.skills-col',
    { opacity: 0, x: 48 },
    {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.4,
      scrollTrigger: {
        trigger: '#resume-card',
        start: 'top 85%',
      },
    }
  );

} else {
  // Fallback to IntersectionObserver if GSAP fails to load
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

const projectModal = document.getElementById('project-modal');
const projectModalClose = document.getElementById('project-modal-close');
const projectModalImage = document.getElementById('project-modal-image');
const projectModalLabel = document.getElementById('project-modal-label');
const projectModalTitle = document.getElementById('project-modal-title');
const projectModalDesc = document.getElementById('project-modal-desc');
const projectModalTech = document.getElementById('project-modal-tech');

const projectModalProblem = document.getElementById('project-modal-problem');
const projectModalRole = document.getElementById('project-modal-role');
const projectModalResult = document.getElementById('project-modal-result');
const caseBlockProblem = document.getElementById('case-block-problem');
const caseBlockRole = document.getElementById('case-block-role');
const caseBlockResult = document.getElementById('case-block-result');

function openProjectModal(card) {
  if (!projectModal || !projectModalImage || !projectModalTitle) return;
  const image = card.dataset.projectImage || '';
  const title = card.dataset.projectTitle || '';
  const label = card.dataset.projectLabel || '';
  const desc = card.dataset.projectDesc || '';
  const tech = (card.dataset.projectTech || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const problem = card.dataset.projectProblem || '';
  const role = card.dataset.projectRole || '';
  const result = card.dataset.projectResult || '';

  projectModalImage.src = image;
  projectModalImage.alt = `${title} project image`;
  if (projectModalLabel) projectModalLabel.textContent = label;
  if (projectModalTitle) projectModalTitle.textContent = title;
  if (projectModalDesc) projectModalDesc.textContent = desc;

  if (projectModalProblem && caseBlockProblem) {
    if (problem) { projectModalProblem.textContent = problem; caseBlockProblem.style.display = 'block'; }
    else caseBlockProblem.style.display = 'none';
  }
  if (projectModalRole && caseBlockRole) {
    if (role) { projectModalRole.textContent = role; caseBlockRole.style.display = 'block'; }
    else caseBlockRole.style.display = 'none';
  }
  if (projectModalResult && caseBlockResult) {
    if (result) { projectModalResult.textContent = result; caseBlockResult.style.display = 'block'; }
    else caseBlockResult.style.display = 'none';
  }

  if (projectModalTech) {
    projectModalTech.innerHTML = '';
    if (tech.length) {
      projectModalTech.style.display = 'flex';
      tech.forEach((item) => {
        const badge = document.createElement('span');
        badge.textContent = item;
        projectModalTech.appendChild(badge);
      });
    } else {
      projectModalTech.style.display = 'none';
    }
  }

  const githubLink = card.dataset.githubLink || '';
  const githubBtn = document.getElementById('project-modal-github');
  if (githubBtn) {
    if (githubLink) {
      githubBtn.href = githubLink;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
    }
  }

  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Accessibility Focus Trap
  const focusable = projectModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    projectModal.addEventListener('keydown', function trapFocus(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else { // Tab
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }
}

function closeProjectModal() {
  if (!projectModal || !projectModalImage) return;
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    projectModalImage.src = '';
  }, 250);
}

document.querySelectorAll('.work-card').forEach((card) => {
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open project: ${card.dataset.projectTitle || 'Project'}`);
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(card);
    }
  });
});

function openCertificateModal(card) {
  if (!projectModal || !projectModalImage || !projectModalTitle) return;
  const imageEl = card.querySelector('img');
  const nameEl = card.querySelector('.cert-name');
  const descEl = card.querySelector('.cert-desc');
  const image = card.dataset.lightbox || imageEl?.getAttribute('src') || '';
  const title = nameEl?.textContent?.trim() || 'Certificate';
  const desc = descEl?.textContent?.trim() || '';

  projectModalImage.src = image;
  projectModalImage.alt = `${title} certificate image`;
  if (projectModalLabel) projectModalLabel.textContent = 'Certificate';
  if (projectModalTitle) projectModalTitle.textContent = title;
  if (projectModalDesc) projectModalDesc.textContent = desc;
  if (projectModalTech) {
    projectModalTech.innerHTML = '';
    projectModalTech.style.display = 'none';
  }

  // Hide case study blocks for certificates
  if (caseBlockProblem) caseBlockProblem.style.display = 'none';
  if (caseBlockRole) caseBlockRole.style.display = 'none';
  if (caseBlockResult) caseBlockResult.style.display = 'none';

  // Hide the case study container border/spacing
  const caseStudyContainer = projectModal.querySelector('.project-modal-case-study');
  if (caseStudyContainer) caseStudyContainer.style.display = 'none';

  // Hide GitHub button for certificates
  const githubBtn = document.getElementById('project-modal-github');
  if (githubBtn) githubBtn.style.display = 'none';

  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');

function openLb(src) {
  if (!lb || !lbImg) return;
  lbImg.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  if (!lb || !lbImg) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    lbImg.src = '';
  }, 350);
}

document.querySelectorAll('[data-lightbox]').forEach((el) => {
  if (el.classList.contains('cert-card')) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    const certTitle = el.querySelector('.cert-name')?.textContent?.trim() || 'Certificate';
    el.setAttribute('aria-label', `Open certificate details: ${certTitle}`);
    el.addEventListener('click', () => openCertificateModal(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertificateModal(el);
      }
    });
    return;
  }
  el.addEventListener('click', () => openLb(el.dataset.lightbox));
});

if (lbClose) lbClose.addEventListener('click', closeLb);
if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (projectModal && projectModal.classList.contains('open')) {
    closeProjectModal();
    return;
  }
  closeLb();
});

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    await new Promise((r) => setTimeout(r, 1000));
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  });
}

// Hero mousemove parallax REMOVED — the Spline 3D robot scene
// now handles mouse interaction natively (head-tracking, etc.)



function smoothScrollToTarget(target) {
  const navOffset = mainNav ? mainNav.offsetHeight + 8 : 72;

  if (typeof lenis !== 'undefined') {
    lenis.scrollTo(target, { offset: -navOffset });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
  const start = window.scrollY;
  const distance = top - start;
  const duration = 1200;
  const startTime = performance.now();

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, start + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    smoothScrollToTarget(target);
    closeMobileMenu();
  });
});

document.addEventListener('click', (e) => {
  if (!navLinksWrap || !hamburger) return;
  if (!navLinksWrap.classList.contains('open')) return;
  if (navLinksWrap.contains(e.target) || hamburger.contains(e.target)) return;
  closeMobileMenu();
});

function initResumeAccordions() {
  const setAccordionState = (accordion, isOpen) => {
    const panel = accordion.querySelector('.resume-accordion-panel');
    const toggle = accordion.querySelector('.resume-accordion-toggle');
    accordion.classList.toggle('open', isOpen);
    if (toggle) toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (panel) panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';
  };

  const buildGroupedAccordion = (col, headingClass, openFirst = true) => {
    if (!col) return;
    const headings = Array.from(col.querySelectorAll(`.${headingClass}`));
    if (!headings.length) return;

    headings.forEach((heading, index) => {
      const accordion = document.createElement('div');
      accordion.className = 'resume-accordion';
      if (openFirst && index === 0) accordion.classList.add('open');

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'resume-accordion-toggle';
      toggle.textContent = heading.textContent.trim();
      toggle.setAttribute('aria-expanded', openFirst && index === 0 ? 'true' : 'false');

      const panel = document.createElement('div');
      panel.className = 'resume-accordion-panel';

      heading.parentNode.insertBefore(accordion, heading);
      heading.remove();

      let node = accordion.nextSibling;
      while (node) {
        const next = node.nextSibling;
        if (node.nodeType === 1 && node.classList.contains(headingClass)) break;
        panel.appendChild(node);
        node = next;
      }

      accordion.appendChild(toggle);
      accordion.appendChild(panel);

      toggle.addEventListener('click', () => {
        const isOpen = accordion.classList.contains('open');
        setAccordionState(accordion, !isOpen);
      });
    });
  };

  const eduCol = document.querySelector('.edu-exp-col');
  buildGroupedAccordion(eduCol, 'col-section-title', true);

  const skillsCol = document.querySelector('.skills-col');
  if (skillsCol) {
    const heading = skillsCol.querySelector('.skills-col-title');
    const toolsGrid = skillsCol.querySelector('.software-grid');
    if (heading && toolsGrid) {
      const accordion = document.createElement('div');
      accordion.className = 'resume-accordion';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'resume-accordion-toggle';
      toggle.textContent = heading.textContent.trim();
      toggle.setAttribute('aria-expanded', 'false');

      const panel = document.createElement('div');
      panel.className = 'resume-accordion-panel';
      panel.appendChild(toolsGrid);

      heading.parentNode.insertBefore(accordion, heading);
      heading.remove();
      accordion.appendChild(toggle);
      accordion.appendChild(panel);

      toggle.addEventListener('click', () => {
        const open = !accordion.classList.contains('open');
        accordion.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
      });
    }
  }

  const accordions = document.querySelectorAll('.resume-accordion');
  accordions.forEach((accordion) => {
    const panel = accordion.querySelector('.resume-accordion-panel');
    if (!panel) return;
    panel.style.maxHeight = accordion.classList.contains('open') ? `${panel.scrollHeight}px` : '0px';
  });

  window.addEventListener('resize', () => {
    accordions.forEach((accordion) => {
      const panel = accordion.querySelector('.resume-accordion-panel');
      if (!panel) return;
      panel.style.maxHeight = accordion.classList.contains('open') ? `${panel.scrollHeight}px` : '0px';
    });
  });
}

initResumeAccordions();

// ── Project Filters & Search ──
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');
  const workCards = document.querySelectorAll('.work-card');

  if (!filterBtns.length || !workCards.length) return;

  let currentCategory = 'all';
  let currentSearch = '';

  function filterProjects() {
    let visibleCount = 0;

    workCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = (card.getAttribute('data-project-title') || '').toLowerCase();
      const tech = (card.getAttribute('data-project-tech') || '').toLowerCase();

      const categoryMatch = currentCategory === 'all' || category === currentCategory;
      const searchMatch = currentSearch === '' ||
        title.includes(currentSearch) ||
        tech.includes(currentSearch);

      if (categoryMatch && searchMatch) {
        card.style.display = 'flex';
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
        visibleCount++;
      } else {
        gsap.to(card, {
          opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.inOut', onComplete: () => {
            card.style.display = 'none';
          }
        });
      }
    });

    ScrollTrigger.refresh();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }

  // Hide empty live links
  workCards.forEach(card => {
    const liveLink = card.getAttribute('data-live-link');
    const liveBtn = card.querySelector('.work-live-btn');
    if (liveBtn && (!liveLink || liveLink === '')) {
      liveBtn.style.display = 'none';
    }
  });
}

initProjectFilters();

// ── Contact Form Handling ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = form?.querySelector('.btn-form-submit');

  if (!form || !submitBtn) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

    // Basic Validation
    let isValid = true;
    const emailInput = form.querySelector('input[type="email"]');

    if (emailInput && !emailRegex.test(emailInput.value)) {
      emailInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        input.parentElement.classList.add('has-error');
        isValid = false;
      }
    });

    if (!isValid) {
      // Shake animation class
      submitBtn.classList.add('is-error');
      setTimeout(() => submitBtn.classList.remove('is-error'), 600);
      return;
    }

    // Prepare data
    const formData = new FormData(form);
    submitBtn.classList.add('is-loading');
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
      .then(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.classList.add('is-success');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent';

        form.reset();

        if (successMsg) {
          successMsg.classList.add('show');
          setTimeout(() => {
            successMsg.classList.remove('show');
            submitBtn.classList.remove('is-success');
            submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right" style="font-size:.7rem"></i>';
            submitBtn.disabled = false;
          }, 5000);
        }
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        submitBtn.classList.remove('is-loading');
        submitBtn.classList.add('is-error');
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        setTimeout(() => {
          submitBtn.classList.remove('is-error');
          submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right" style="font-size:.7rem"></i>';
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}

initContactForm();
