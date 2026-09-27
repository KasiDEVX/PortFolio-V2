
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

