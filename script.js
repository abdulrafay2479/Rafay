/* script.js — Abdul Rafay Qaimkhani Portfolio */

/* ============================================================
   1. NAVBAR — scroll shadow + active link highlight
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Add .scrolled class once page has scrolled past 60px
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight the currently visible section's nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   2. HAMBURGER MENU — mobile toggle
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ============================================================
   3. TYPING ANIMATION — hero subtitle
   ============================================================ */
(function initTypingAnimation() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const phrases = [
    'Computer Science Student',
    'Web Developer',
    'Problem Solver',
    'Open Source Enthusiast',
    'Future Software Engineer',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 400;

  function type() {
    if (isPaused) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Finished typing; pause then start deleting
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
        }, PAUSE_AFTER);
      } else {
        setTimeout(type, TYPING_SPEED);
      }
    } else {
      // Deleting
      typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          setTimeout(type, TYPING_SPEED);
        }, PAUSE_BEFORE);
      } else {
        setTimeout(type, DELETING_SPEED);
      }
    }
  }

  // Slight delay before starting so the page has rendered
  setTimeout(type, 700);
})();

/* ============================================================
   4. SCROLL-TRIGGERED ANIMATIONS — Intersection Observer
   ============================================================ */
(function initScrollAnimations() {
  const animatables = document.querySelectorAll(
    '.fade-up, .fade-left, .fade-right'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatables.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. SKILL BAR ANIMATIONS
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-item');

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerSkillBar(entry.target);
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => barObserver.observe(bar));
})();

function triggerSkillBar(barItem) {
  const fill = barItem.querySelector('.skill-bar-fill');
  if (!fill) return;
  const targetWidth = fill.getAttribute('data-width');
  if (targetWidth) {
    // requestAnimationFrame ensures the transition fires after paint
    requestAnimationFrame(() => {
      fill.style.width = targetWidth + '%';
    });
  }
}

/* ============================================================
   6. FLOATING PARTICLES — hero background
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const PARTICLE_COUNT = 24;
  const colors = ['#a855f7', '#22d3ee', '#7c3aed', '#06b6d4'];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const dot = document.createElement('div');
    dot.classList.add('particle');

    const size     = Math.random() * 4 + 1;
    const left     = Math.random() * 100;
    const duration = Math.random() * 18 + 10;
    const delay    = Math.random() * 20;
    const color    = colors[Math.floor(Math.random() * colors.length)];

    dot.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;

    container.appendChild(dot);
  }
})();

/* ============================================================
   7. CONTACT FORM — basic validation + feedback
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const msgEl      = document.getElementById('form-message');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showMessage('⚠️ Please fill in all fields.', '#f87171');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showMessage('⚠️ Please enter a valid email address.', '#f87171');
      return;
    }

    // Simulate a successful submission (replace with real endpoint if needed)
    showMessage('✅ Thanks for reaching out! I\'ll get back to you soon.', '#22d3ee');
    form.reset();
  });

  function showMessage(text, color) {
    msgEl.textContent = text;
    msgEl.style.color = color;
    setTimeout(() => { msgEl.textContent = ''; }, 6000);
  }
})();

/* ============================================================
   8. FOOTER YEAR
   ============================================================ */
(function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   9. SMOOTH SCROLL — for all anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
