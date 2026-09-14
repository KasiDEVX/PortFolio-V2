
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
  const mobileNav = document.getElementById('mobile-nav-menu');
  if (mobileNav && mobileNav.classList.contains('open')) {
    closeMobileMenu();
    return;
  }
  if (projectModal && projectModal.classList.contains('open')) {
    closeProjectModal();
    return;
  }
  closeLb();
});



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
  const mobileNav = document.getElementById('mobile-nav-menu');
  if (!mobileNav || !hamburger) return;
  if (!mobileNav.classList.contains('open')) return;
  if (mobileNav.contains(e.target) || hamburger.contains(e.target)) return;
  closeMobileMenu();
});

function initProjectLiveLinks() {
  const workCards = document.querySelectorAll('.work-card');
  workCards.forEach(card => {
    const liveLink = card.getAttribute('data-live-link');
    const liveBtn = card.querySelector('.work-live-btn');
    if (liveBtn && (!liveLink || liveLink === '')) {
      liveBtn.style.display = 'none';
    }
  });
}

initProjectLiveLinks();

