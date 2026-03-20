/* ============================================================
   GRUPO BRIONES — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR (desktop only) ─────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing && window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();

    const interactiveEls = document.querySelectorAll('a, button, .project-card, .blog-card, .pill');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform     = 'translate(-50%,-50%) scale(3)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)';
        cursorRing.style.opacity   = '0.2';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.opacity   = '0.45';
      });
    });
  }

  // ── HEADER SCROLL ────────────────────────────────────────
  const header = document.getElementById('mainHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ── MOBILE MENU ──────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  window.closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close on overlay click
  if (mobileMenu) {
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) window.closeMobileMenu();
    });
  }

  // ── COUNTER ANIMATION ────────────────────────────────────
  const countEls = document.querySelectorAll('[data-target]');

  const animateCounter = el => {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2200;
    const start    = performance.now();

    const tick = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target).toLocaleString('es-AR') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (countEls.length && 'IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(el => statsObs.observe(el));
  }

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  }

  // ── FILTER PILLS ─────────────────────────────────────────
  window.filterPill = (el, group) => {
    const container = el.closest('[data-group="' + group + '"]') || el.closest('.filter-pills');
    if (container) {
      container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    }
    el.classList.add('active');
  };

  // ── CONTACT FORM ─────────────────────────────────────────
  window.submitForm = e => {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    btn.textContent = '¡Consulta enviada! Te contactamos pronto.';
    btn.classList.add('form-success');
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Enviar Consulta';
      btn.classList.remove('form-success');
      btn.disabled = false;
      e.target.reset();
    }, 5000);
  };

  // ── SMOOTH ANCHOR SCROLL ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        window.closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
