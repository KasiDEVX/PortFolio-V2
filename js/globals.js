const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Automatic hardware/memory capability detection for high-performance Lite Mode
if (typeof navigator !== 'undefined') {
  if ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4)) {
    document.body.classList.add('lite-mode');
  }
}

const mainNav = document.getElementById('main-nav');
const mobileNavMenu = document.getElementById('mobile-nav-menu');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const hamburger = document.getElementById('hamburger');
const scrollProgress = document.getElementById('scroll-progress');

function initHeroVideo() {
  const heroVideo = document.querySelector('.hero-video');
  if (!heroVideo) return;

  heroVideo.muted = true;
  heroVideo.defaultMuted = true;

  const attemptPlay = () => {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const onFirstInteraction = () => {
          heroVideo.play().catch(() => {});
          ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
            window.removeEventListener(evt, onFirstInteraction);
          });
        };
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
          window.addEventListener(evt, onFirstInteraction, { once: true, passive: true });
        });
      });
    }
  };

  attemptPlay();

  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.fromTo(heroVideo,
      { scale: 1.06, opacity: 0.8 },
      { scale: 1.0, opacity: 1, duration: 2.8, ease: 'power2.out', delay: 0.2 }
    );
  } else {
    heroVideo.style.transform = 'scale(1)';
    heroVideo.style.opacity = '1';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroVideo);
} else {
  initHeroVideo();
}

const qs  = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function initLoader() {
  const loader = qs('#loader');
  const reveal = qs('#page-reveal');
  const revealStrips = qsa('.reveal-strip', reveal || document);
  const scene = qs('.loader-scene', loader || document);
  const noise = qs('.loader-noise', loader || document);
  const logo = qs('.loader-logo', loader || document);
  const letters = qsa('.loader-letter', loader || document);
  const particles = qsa('.loader-particle', loader || document);
  const light = qs('.loader-light', loader || document);
  const line = qs('.loader-line', loader || document);
  if (!loader) return;

  const markLoaded = () => {
    if (!document.body.classList.contains('loaded')) {
      document.body.classList.add('loaded');
    }
    if (!document.body.classList.contains('effects-ready')) {
      document.body.classList.add('effects-ready');
    }
  };

  const finishLoader = () => {
    if (loader && loader.parentNode) loader.remove();
    if (reveal) {
      reveal.classList.add('done');
      reveal.style.display = 'none';
    }
    markLoaded();
    if (!document.body.classList.contains('hero-ready')) {
      document.body.classList.add('hero-ready');
    }
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 60);
    }
  };

  const failSafeReveal = window.setTimeout(() => {
    loader.classList.add('hide');
    finishLoader();
  }, 8000);

  if (prefersReducedMotion) {
    window.clearTimeout(failSafeReveal);
    if (typeof gsap === 'undefined') {
      window.setTimeout(finishLoader, 900);
      return;
    }

    gsap.set(loader, { opacity: 1 });
    gsap.set(reveal, { opacity: 1 });
    gsap.set(revealStrips, { yPercent: -120 });
    gsap.set(noise, { opacity: 0.03 });
    gsap.set(scene, { scale: 1.01, y: 8 });
    gsap.set(light, { opacity: 0, xPercent: -100, yPercent: -50 });
    gsap.set(line, { scaleX: 0.2, transformOrigin: 'center center', opacity: 0.9 });
    gsap.set(logo, { scaleX: 1, y: 6 });
    gsap.set(letters, {
      y: 18,
      scale: 0.98,
      opacity: 0,
      x: 0
    });
    gsap.set(particles, { opacity: 0.18 });

    const reducedTl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: finishLoader
    });

    reducedTl
      .to(scene, {
        y: 0,
        scale: 1,
        duration: 0.48
      }, 0)
      .to(letters, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.82,
        stagger: 0.11
      })
      .to(logo, {
        y: 0,
        duration: 0.62,
        ease: 'power3.out'
      }, 0.14)
      .to(light, {
        opacity: 0.55,
        xPercent: 100,
        duration: 0.9,
        ease: 'power2.inOut'
      }, 0.42)
      .to(line, {
        scaleX: 1,
        duration: 0.7,
        ease: 'power2.inOut'
      }, 0.98);

    const reducedEnterEases = ['power2.out', 'power3.out', 'power4.out', 'expo.out', 'expo.out'];
    revealStrips.forEach((strip, index) => {
      reducedTl.to(strip, {
        yPercent: 0,
        duration: 0.56 + index * 0.08,
        ease: reducedEnterEases[index] || 'power3.out'
      }, 1.08 + index * 0.14);
    });

    reducedTl.to(loader, {
      opacity: 0,
      duration: 0.24,
      ease: 'power1.out'
    }, 2.3);

    const reducedExitEases = ['expo.inOut', 'power4.inOut', 'power3.inOut', 'power2.inOut', 'sine.inOut'];
    reducedTl.call(markLoaded, null, 2.38);
    [...revealStrips].reverse().forEach((strip, index) => {
      reducedTl.to(strip, {
        yPercent: -120,
        duration: 0.88 + index * 0.12,
        ease: reducedExitEases[index] || 'power3.inOut'
      }, 2.38 + index * 0.18);
    });

    reducedTl.set(reveal, { opacity: 0 }, 4.72);
    return;
  }

  if (typeof gsap === 'undefined') {
    window.clearTimeout(failSafeReveal);
    if (!revealStrips.length || !reveal) {
      window.setTimeout(() => {
        loader.classList.add('hide');
        window.setTimeout(finishLoader, 500);
      }, 1800);
      return;
    }

    reveal.classList.remove('done', 'reveal-enter', 'reveal-exit');
    reveal.classList.add('fallback-play');
    reveal.style.display = '';
    reveal.style.opacity = '1';

    const enterTotal = 1400;
    const exitTotal = 1900;

    requestAnimationFrame(() => {
      reveal.classList.add('reveal-enter');
    });

    window.setTimeout(() => {
      loader.classList.add('hide');
      reveal.classList.remove('reveal-enter');
      reveal.classList.add('reveal-exit');
      markLoaded();
    }, enterTotal);

    window.setTimeout(() => {
      reveal.classList.remove('fallback-play', 'reveal-exit');
      finishLoader();
    }, enterTotal + exitTotal + 120);
    return;
  }

  gsap.set(loader, { opacity: 1 });
  gsap.set(reveal, { opacity: 1 });
  gsap.set(revealStrips, { yPercent: -120 });
  gsap.set(scene, {
    scale: 1.035,
    y: 22,
    transformOrigin: '50% 50%'
  });
  gsap.set(noise, { opacity: 0 });
  gsap.set(light, { opacity: 0, xPercent: -140, yPercent: -50 });
  gsap.set(line, { scaleX: 0, transformOrigin: 'center center', opacity: 0.9 });
  gsap.set(logo, {
    scaleX: 1,
    y: 24,
    transformOrigin: '50% 50%'
  });
  gsap.set(letters, {
    y: 80,
    x: (index) => (index - 1.5) * 10,
    scale: 0.9,
    opacity: 0,
    transformOrigin: '50% 100%'
  });
  gsap.set(particles, { opacity: 0.12 });

  particles.forEach((particle, index) => {
    gsap.to(particle, {
      opacity: 0.2 + (index % 3) * 0.05,
      y: (index % 2 === 0 ? -8 : 8),
      scale: 1 + (index % 4) * 0.08,
      duration: 1.6 + index * 0.08,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1
    });
  });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      window.clearTimeout(failSafeReveal);
      finishLoader();
    }
  });

  tl
    .to(scene, {
      y: 0,
      scale: 1,
      duration: 0.82,
      ease: 'power3.out'
    }, 0)
    .to(noise, {
      opacity: 0.05,
      duration: 0.54,
      ease: 'power2.out'
    })
    .to(letters, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration: 1.22,
      ease: 'power4.out',
      stagger: 0.19
    }, 0.2)
    .to(logo, {
      y: 0,
      duration: 1.12,
      ease: 'power4.out'
    }, 0.28)
    .to(light, {
      opacity: 1,
      xPercent: 140,
      duration: 1.42,
      ease: 'power2.inOut'
    }, 1.62)
    .to(light, {
      opacity: 0,
      duration: 0.42,
      ease: 'power1.out'
    }, 2.48)
    .to(logo, {
      scaleX: 0.9,
      duration: 0.58,
      ease: 'power3.inOut'
    }, 2.58)
    .to(logo, {
      y: -4,
      duration: 0.4,
      ease: 'sine.out'
    }, 2.74)
    .to(logo, {
      y: 0,
      duration: 0.52,
      ease: 'sine.inOut'
    }, 3.02)
    .to(line, {
      scaleX: 1,
      duration: 0.98,
      ease: 'power3.inOut'
    }, 2.66);

  const revealEnterEases = ['power2.out', 'power3.out', 'power4.out', 'expo.out', 'expo.out'];
  revealStrips.forEach((strip, index) => {
    tl.to(strip, {
      yPercent: 0,
      duration: 0.72 + index * 0.1,
      ease: revealEnterEases[index] || 'power3.out'
    }, 2.84 + index * 0.16);
  });

  tl.to(loader, {
    opacity: 0,
    duration: 0.26,
    ease: 'power2.out'
  }, 4.38);

  const revealExitEases = ['expo.inOut', 'power4.inOut', 'power3.inOut', 'power2.inOut', 'sine.inOut'];
  tl.call(markLoaded, null, 4.5);
  [...revealStrips].reverse().forEach((strip, index) => {
    tl.to(strip, {
      yPercent: -120,
      duration: 1.02 + index * 0.14,
      ease: revealExitEases[index] || 'power3.inOut'
    }, 4.5 + index * 0.2);
  });

  tl.set(reveal, { opacity: 0 }, 7.18);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoader);
} else {
  initLoader();
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  setTimeout(() => {
    document.body.classList.add("effects-ready");
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 120);
});

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
  lerp: 0.08,
});

// Clean single-driver integration: GSAP Ticker drives Lenis exclusively
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
} else {
  function rafFallback(time) {
    lenis.raf(time);
    requestAnimationFrame(rafFallback);
  }
  requestAnimationFrame(rafFallback);
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
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
}

