function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = form?.querySelector('.btn-form-submit');

  if (!form || !submitBtn) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

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
      submitBtn.classList.add('is-error');
      setTimeout(() => submitBtn.classList.remove('is-error'), 600);
      return;
    }

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

/* ==================================================
   CUSTOM GEOMETRIC ARROW CURSOR (Fine-pointer Desktop Only)
================================================== */
function initCustomCursor() {
  // Guard 1: Must have a fine pointer and support hover (desktops/laptops with mouse/trackpad)
  // Completely bypassed on touchscreens, phones, and tablets
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer || prefersReducedMotion) return;

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const cursorText = cursor.querySelector('.cursor-text');

  let mouseX = -200;
  let mouseY = -200;
  let isVisible = false;
  let rafId = null;

  const updatePosition = () => {
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    rafId = null;
  };

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursor.classList.remove('is-hidden');
    }

    if (!rafId) {
      rafId = requestAnimationFrame(updatePosition);
    }
  };

  const onMouseLeave = () => {
    isVisible = false;
    cursor.classList.add('is-hidden');
  };

  const onMouseEnter = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isVisible = true;
    cursor.classList.remove('is-hidden');
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('mouseenter', onMouseEnter);

  // Tactile impulse and shockwave ripple on mouse clicks
  const rippleEl = document.getElementById('cursor-ripple');
  const triggerRipple = () => {
    if (rippleEl) {
      rippleEl.classList.remove('is-active');
      void rippleEl.offsetWidth; // trigger reflow
      rippleEl.classList.add('is-active');
    }
  };

  window.addEventListener('mousedown', () => {
    cursor.classList.add('is-clicking');
    triggerRipple();
  }, { passive: true });

  window.addEventListener('mouseup', () => cursor.classList.remove('is-clicking'), { passive: true });

  // Contextual states via passive mouseover delegation
  const setCursorState = (state, text = '') => {
    cursor.classList.remove('is-hovering', 'is-view', 'is-look', 'is-drag', 'is-copy', 'is-visit', 'is-secret', 'is-close', 'has-badge');
    if (state) cursor.classList.add(state);
    if (text) {
      cursor.classList.add('has-badge');
      if (cursorText) cursorText.textContent = text;
    } else if (cursorText) {
      cursorText.textContent = '';
    }
  };

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target) return;

    // 1. Modal close button or terminal close
    if (target.closest('.project-modal-close, .modal-close, #lb-close, #terminal-close-btn, #terminal-close-dot')) {
      setCursorState('is-close', 'CLOSE');
      return;
    }

    // 2. Secret Brand Wordmark / Footer
    if (target.closest('.footer-giant-wordmark, .footer-brand-stage')) {
      setCursorState('is-secret', 'TYPE "KASI"');
      return;
    }

    // 3. Email links (Copy action)
    if (target.closest('a[href^="mailto:"]')) {
      setCursorState('is-copy', 'COPY');
      return;
    }

    // 4. External Live Links & Social Icons
    if (target.closest('.project-modal-live, .project-modal-github, .contact-pill-btn, .footer-squircle-btn, a[target="_blank"]')) {
      setCursorState('is-visit', 'VISIT');
      return;
    }

    // 5. Certificates corridor
    if (target.closest('.certs-viewport, .certs-slider, .cert-card, .certs-track')) {
      setCursorState('is-look', 'VIEW');
      return;
    }

    // 6. Project cards & showcase
    if (target.closest('.work-flagship, .work-card, .work-card-media, .featured-card')) {
      if (target.closest('a, button')) {
        setCursorState('is-hovering');
      } else {
        setCursorState('is-view', 'VIEW ↗');
      }
      return;
    }

    // 7. Interactive elements (links, buttons, inputs, labels, selects, chips)
    if (target.closest('a, button, input, textarea, select, label, .hamburger, [role="button"], .nav-logo-center, .back-to-top, .term-chip')) {
      setCursorState('is-hovering');
      return;
    }

    // Default
    setCursorState('');
  }, { passive: true });
}

initCustomCursor();

/* ==================================================
   FLOATING LIVE TIME PILL (Choice B: 0-overhead updater)
================================================== */
function initLiveTime() {
  const timeValEl = document.getElementById('live-time-val');
  if (!timeValEl) return;

  const updateClock = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    timeValEl.textContent = formatted;
  };

  updateClock();
  // Update every 10s to guarantee accurate minute turnover with virtually 0 CPU
  setInterval(updateClock, 10000);
}

initLiveTime();

/* ==================================================
   TOP-RIGHT NOTIFICATION TOAST & EMAIL CLIPBOARD
================================================== */
function showToast({ title, desc, icon = 'fa-check' }) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'luxury-toast';
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icon}" aria-hidden="true"></i></div>
    <div class="toast-content">
      <span class="toast-title">${title}</span>
      <span class="toast-desc">${desc}</span>
    </div>
    <div class="toast-progress" aria-hidden="true"></div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('is-show');
  });

  setTimeout(() => {
    toast.classList.add('is-hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 450);
  }, 3200);
}

function initEmailClipboard() {
  document.addEventListener('click', (e) => {
    const emailLink = e.target.closest('a[href^="mailto:"]');
    if (!emailLink) return;

    e.preventDefault();
    const mailtoHref = emailLink.getAttribute('href') || '';
    const email = mailtoHref.replace('mailto:', '').split('?')[0].trim();
    if (!email) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          showToast({
            title: 'Copied to clipboard!',
            desc: email,
            icon: 'fa-clipboard-check'
          });
        })
        .catch(() => {
          window.location.href = mailtoHref;
        });
    } else {
      window.location.href = mailtoHref;
    }
  });
}

initEmailClipboard();

