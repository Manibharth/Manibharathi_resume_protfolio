/* ════════════════════════════════════════════════════════════
   PORTFOLIO · SCRIPT.JS
════════════════════════════════════════════════════════════ */

/* ─── 1. LOADING SCREEN ─────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1800);
});

/* ─── 2. CURRENT YEAR ──────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── 3. PARTICLE CANVAS (Neural Network style) ─────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 80;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function makeParticle() {
    return {
      x:   randBetween(0, W),
      y:   randBetween(0, H),
      vx:  randBetween(-0.35, 0.35),
      vy:  randBetween(-0.35, 0.35),
      r:   randBetween(1.5, 3),
      hue: Math.random() > 0.5 ? 195 : 270  // cyan ≈ 195 | purple ≈ 270
    };
  }

  particles = Array.from({ length: COUNT }, makeParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${particles[i].hue}, 100%, 65%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, 0.9)`);
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── 4. TYPING ANIMATION ───────────────────────────────────── */
(function initTyping() {
  const roles = [
    'Software Developer',
    'AI Developer',
    'Backend Developer',
    'Cybersecurity Enthusiast',
    'Competitive Programmer',
    'Open Source Contributor'
  ];
  const el = document.getElementById('typedText');
  let roleIdx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, DELAY_END = 1800, DELAY_START = 400;

  function type() {
    const role = roles[roleIdx];
    if (deleting) {
      charIdx--;
      el.textContent = role.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(type, DELAY_START);
        return;
      }
      setTimeout(type, SPEED_DEL);
    } else {
      charIdx++;
      el.textContent = role.slice(0, charIdx);
      if (charIdx === role.length) {
        deleting = true;
        setTimeout(type, DELAY_END);
        return;
      }
      setTimeout(type, SPEED_TYPE);
    }
  }
  setTimeout(type, 1000);
})();

/* ─── 5. NAVBAR SCROLL BEHAVIOUR ───────────────────────────── */
const navbar  = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  // Scrolled style
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Back-to-top
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── 6. MOBILE MENU ────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── 7. SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ─── 8. BACK TO TOP ────────────────────────────────────────── */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── 9. SCROLL REVEAL (Intersection Observer) ──────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    // Stagger sibling cards
    const siblings = [...entry.target.parentElement.children].filter(c =>
      c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
    );
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => {
      entry.target.classList.add('active');
    }, idx * 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── 10. SKILL BAR ANIMATIONS ─────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target;
    fill.style.width = fill.dataset.w + '%';
    skillObserver.unobserve(fill);
  });
}, { threshold: 0.5 });

skillFills.forEach(f => skillObserver.observe(f));

/* ─── 11. COUNTER ANIMATIONS ────────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-number[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target, parseInt(entry.target.dataset.count));
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

counterEls.forEach(el => counterObserver.observe(el));

/* ─── 12. CONTACT FORM ──────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const note   = document.getElementById('formNote');
  const btn    = this.querySelector('button[type="submit"]');
  const name   = document.getElementById('name').value.trim();
  const email  = document.getElementById('email').value.trim();
  const msg    = document.getElementById('message').value.trim();

  if (!name || !email || !msg) {
    note.textContent = '⚠ Please fill in all required fields.';
    note.style.color = '#ef4444';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate send (replace with EmailJS / backend call)
  setTimeout(() => {
    note.textContent  = '✓ Message sent! I\'ll get back to you soon.';
    note.style.color  = 'var(--green)';
    btn.disabled      = false;
    btn.innerHTML     = '<i class="fas fa-paper-plane"></i> Send Message';
    this.reset();
    setTimeout(() => { note.textContent = ''; }, 5000);
  }, 1500);
});

/* ─── 13. PROJECT CARD TILT ON HOVER ───────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ─── 14. ACHIEVEMENT CARD GLOW ON HOVER ───────────────────── */
document.querySelectorAll('.achievement-card').forEach(card => {
  const icon  = card.querySelector('.ach-icon');
  const color = getComputedStyle(icon).getPropertyValue('--ach').trim();
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 16px 48px rgba(0,0,0,.35), 0 0 0 1px ${color}33`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ─── 15. ACTIVE SECTION HIGHLIGHT (navbar) ─────────────────── */
// Already handled in onScroll (step 5)

/* ─── 16. KEYBOARD SHORTCUT: ESC closes mobile menu ─────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});
