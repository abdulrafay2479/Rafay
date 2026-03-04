/* ============================================================
   script.js  –  Portfolio interactions
   ============================================================ */

/* ----------------------------------------------------------
   1. TYPING ANIMATION
   ---------------------------------------------------------- */
const typingEl   = document.getElementById('typingText');
const phrases    = [
  'Computer Science Student',
  'Web Developer',
  'Problem Solver',
  'Open-Source Enthusiast',
];
let   phraseIdx  = 0;
let   charIdx    = 0;
let   deleting   = false;
const TYPING_SPEED   = 80;   // ms per char typed
const DELETING_SPEED = 45;   // ms per char deleted
const PAUSE_END      = 1800; // ms pause after full phrase
const PAUSE_START    = 400;  // ms pause before typing next

function type() {
  const current = phrases[phraseIdx];

  if (deleting) {
    charIdx--;
    typingEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting   = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      setTimeout(type, PAUSE_START);
      return;
    }
    setTimeout(type, DELETING_SPEED);
  } else {
    typingEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, PAUSE_END);
      return;
    }
    setTimeout(type, TYPING_SPEED);
  }
}

type();

/* ----------------------------------------------------------
   2. NAVBAR – scroll class + active link highlight
   ---------------------------------------------------------- */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scrolled class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link based on current section
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ----------------------------------------------------------
   3. HAMBURGER MENU
   ---------------------------------------------------------- */
const hamburger    = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinksMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinksMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ----------------------------------------------------------
   4. INTERSECTION OBSERVER – scroll reveal
   ---------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ----------------------------------------------------------
   5. SKILL BARS – animate width when in view
   ---------------------------------------------------------- */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill  = entry.target.querySelector('.skill-bar-fill');
        const width = fill.dataset.width;
        fill.style.width = `${width}%`;
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.skill-bar-item').forEach((item) => {
  barObserver.observe(item);
});

/* ----------------------------------------------------------
   6. CONTACT FORM – simple client-side validation
   ---------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showNote('Please fill in all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNote('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate send (replace with real API / EmailJS / etc.)
    showNote('Message received! (Connect a backend or EmailJS to enable real sending.) 🚀', 'success');
    contactForm.reset();
  });
}

function showNote(msg, type) {
  formNote.textContent = msg;
  formNote.className   = `form-note ${type}`;
  setTimeout(() => {
    formNote.textContent = '';
    formNote.className   = 'form-note';
  }, 5000);
}

/* ----------------------------------------------------------
   7. FOOTER – dynamic copyright year
   ---------------------------------------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ----------------------------------------------------------
   8. SMOOTH SCROLL POLYFILL for older browsers
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
