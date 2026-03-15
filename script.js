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
   6. THREE.JS SMOKE EFFECT — WebGL fixed background
   ============================================================ */
(function initSmokeEffect() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;

  /* ---- Scene / Camera / Renderer ---- */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 1000;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: false, // disabled for performance; smoke planes are soft so AA is unnecessary
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ---- Procedural smoke texture via HTML5 Canvas 2D ---- */
  function createSmokeTexture() {
    const c   = document.createElement('canvas');
    c.width   = 256;
    c.height  = 256;
    const ctx = c.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
    gradient.addColorStop(0,   'rgba(210, 180, 255, 0.85)');
    gradient.addColorStop(0.35,'rgba(140,  80, 220, 0.45)');
    gradient.addColorStop(0.7, 'rgba( 60,  20, 120, 0.15)');
    gradient.addColorStop(1,   'rgba(  0,   0,   0,  0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  const smokeTexture = createSmokeTexture();

  /* ---- Lights ---- */
  const ambientLight = new THREE.AmbientLight(0x444466, 2.5);
  scene.add(ambientLight);

  const pointLight = new THREE.DirectionalLight(0xaa88ff, 1.5);
  pointLight.position.set(0, 400, 500);
  scene.add(pointLight);

  /* ---- Smoke particles ---- */
  const GEO = new THREE.PlaneGeometry(300, 300);
  const smokeMeshes = [];

  const SMOKE_MIN_OPACITY   = 0.07;
  const SMOKE_OPACITY_RANGE = 0.25;

  for (let i = 0; i < 80; i++) {
    const mat = new THREE.MeshLambertMaterial({
      map:         smokeTexture,
      transparent: true,
      opacity:     Math.random() * SMOKE_OPACITY_RANGE + SMOKE_MIN_OPACITY,
      depthWrite:  false,
    });

    const mesh = new THREE.Mesh(GEO, mat);
    mesh.position.set(
      Math.random() * 1000 - 500,
      Math.random() * 1000 - 500,
      Math.random() * -400
    );
    mesh.rotation.z = Math.random() * Math.PI * 2;
    scene.add(mesh);
    smokeMeshes.push(mesh);
  }

  /* ---- Mouse parallax ---- */
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice) {
    document.addEventListener('mousemove', function (e) {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 300;
      targetY = (e.clientY / window.innerHeight - 0.5) * 300;
    }, { passive: true });
  }

  /* ---- Resize ---- */
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  /* ---- Animation loop ---- */
  function animate() {
    requestAnimationFrame(animate);

    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    camera.position.x = currentX;
    camera.position.y = -currentY;

    smokeMeshes.forEach(function (mesh) {
      mesh.rotation.z += 0.0008;
    });

    renderer.render(scene, camera);
  }

  animate();
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
