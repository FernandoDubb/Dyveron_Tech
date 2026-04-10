/* ══════════════════════════════════════════════
   DYVERON TECH — app.js (v2.0)
   ══════════════════════════════════════════════ */

/* ── CURSOR (solo desktop) ─────────────────────── */
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (!isMobile) {
  const cD = document.getElementById('cD');
  const cR = document.getElementById('cR');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cD.style.left = mx + 'px';
    cD.style.top  = my + 'px';
  });

  (function animateCursor() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    cR.style.left = rx + 'px';
    cR.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .pc, .sc2, .prc').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
} else {
  // Ocultar cursor en mobile
  const cD = document.getElementById('cD');
  const cR = document.getElementById('cR');
  if (cD) cD.style.display = 'none';
  if (cR) cR.style.display = 'none';
}

/* ── NAV SCROLL ────────────────────────────────── */
const nav = document.getElementById('nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  nav.classList.toggle('sc', scrollY > 40);
  lastScrollY = scrollY;
});

/* ── MOBILE MENU ───────────────────────────────── */
const menuBtn  = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mmLinks  = document.querySelectorAll('.mm-link');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const isOpen = mobileMenu.classList.contains('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  // Animar barras del botón
  const spans = menuBtn.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Cerrar menu al hacer click en un link
mmLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── CANVAS PARTÍCULAS ─────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bgC');
  const ctx    = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - .5) * .32;
      this.vy  = (Math.random() - .5) * .32 - .08;
      this.r   = Math.random() * 1.4 + .2;
      this.a   = Math.random() * .55 + .1;
      // 55% índigo, 30% cian, 15% violeta
      const roll = Math.random();
      this.col = roll < .55 ? '99,102,241'
               : roll < .85 ? '6,182,212'
               :               '168,85,247';
    }
    tick() {
      this.x += this.vx; this.y += this.vy; this.a -= .0007;
      if (this.y < -10 || this.a <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${Math.max(0, this.a)})`;
      ctx.fill();
    }
  }

  // Menos partículas en mobile para rendimiento
  const count = isMobile ? 40 : 75;
  for (let i = 0; i < count; i++) pts.push(new Particle());

  function drawLines() {
    if (isMobile) return; // No lineas en mobile para mejor rendimiento
    const maxDist = 110;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${.025 * (1 - d/maxDist)})`;
          ctx.lineWidth   = .5;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    pts.forEach(p => { p.tick(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ── SCROLL REVEAL ─────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal'));
      const delay = siblings.indexOf(e.target) * 130;
      setTimeout(() => e.target.classList.add('vis'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── PROCESO REVEAL ────────────────────────────── */
const processObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.prc').forEach((card, i) =>
        setTimeout(() => card.classList.add('vis'), i * 140)
      );
      processObserver.disconnect();
    }
  });
}, { threshold: .1 });

const pg = document.querySelector('.procg');
if (pg) processObserver.observe(pg);

/* ── SERVICIOS REVEAL ──────────────────────────── */
const servObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.sc2').forEach((card, i) =>
        setTimeout(() => card.classList.add('vis'), i * 120)
      );
      servObserver.disconnect();
    }
  });
}, { threshold: .06 });

const sg = document.querySelector('.sgrid');
if (sg) servObserver.observe(sg);

/* ── COUNTER ANIMATION ─────────────────────────── */
function animateCounter(el, target, duration = 1200) {
  const isPercent = el.querySelector ? false : el.textContent.includes('%');
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + (isPercent ? '%' : '+');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Observer para stats strip
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    statsObserver.disconnect();
    document.querySelectorAll('.sn').forEach(el => {
      const text = el.textContent;
      if (text.includes('4')) animateCounter(el, 4);
      else if (text.includes('100')) {
        let s = 0;
        const step = ts => {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1000, 1);
          el.textContent = Math.floor(p * 100) + '%';
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
  }
}, { threshold: .5 });

const sstrip = document.querySelector('.sstrip');
if (sstrip) statsObserver.observe(sstrip);

/* ── SMOOTH NAV LINKS ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── ACTIVE NAV LINK ───────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: .4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── FORMULARIO → WHATSAPP ─────────────────────── */
document.getElementById('fBtn').addEventListener('click', function () {
  const name    = document.getElementById('fN').value.trim();
  const contact = document.getElementById('fC').value.trim();
  const service = document.getElementById('fS').value;
  const message = document.getElementById('fM').value.trim();

  if (!name) {
    // Shake animation en el input
    const input = document.getElementById('fN');
    input.style.borderColor = 'rgba(240,82,82,0.7)';
    input.style.boxShadow = '0 0 0 3px rgba(240,82,82,0.12)';
    input.focus();
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 2500);
    return;
  }

  const text =
    `Hola Fernando 👋, vi tu portafolio de Dyveron Tech.%0A%0A` +
    `*Nombre:* ${encodeURIComponent(name)}%0A` +
    `*Contacto:* ${encodeURIComponent(contact || '—')}%0A` +
    `*Servicio:* ${encodeURIComponent(service || 'Sin especificar')}%0A` +
    `*Mensaje:* ${encodeURIComponent(message || 'Sin mensaje adicional')}`;

  window.open(`https://wa.me/50432591982?text=${text}`, '_blank');
});

/* ── PARALLAX SUAVE EN HERO ──────────────────────── */
if (!isMobile) {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.06;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
}
