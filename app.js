/* ══════════════════════════════════════════════
   DYVERON TECH — app.js (v5.0)
   ══════════════════════════════════════════════ */

const isMobile = window.matchMedia('(max-width: 768px)').matches;

/* ── CURSOR (solo desktop) ─────────────────────── */
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

  document.querySelectorAll('a, button, .pc, .sc2, .prc, .tc').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
  });
} else {
  const cD = document.getElementById('cD');
  const cR = document.getElementById('cR');
  if (cD) cD.style.display = 'none';
  if (cR) cR.style.display = 'none';
}

/* ── NAV SCROLL ────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('sc', scrollY > 40);
}, { passive: true });

/* ── MOBILE MENU ───────────────────────────────── */
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mmLinks    = document.querySelectorAll('.mm-link');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const isOpen = mobileMenu.classList.contains('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
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
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .25;
      this.vy = (Math.random() - .5) * .25 - .06;
      this.r  = Math.random() * 1.2 + .2;
      this.a  = Math.random() * .45 + .07;
      const roll = Math.random();
      this.col = roll < .55 ? '59,143,232'
               : roll < .82 ? '98,170,255'
               :              '22,96,184';
    }
    tick() {
      this.x += this.vx; this.y += this.vy; this.a -= .00055;
      if (this.y < -10 || this.a <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${Math.max(0, this.a)})`;
      ctx.fill();
    }
  }

  const count = isMobile ? 35 : 65;
  for (let i = 0; i < count; i++) pts.push(new Particle());

  function drawLines() {
    if (isMobile) return;
    const maxDist = 100;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(59,143,232,${.018 * (1 - d/maxDist)})`;
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

/* ── SCROLL REVEAL — proyectos ─────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal'));
      const delay = siblings.indexOf(e.target) * 130;
      setTimeout(() => e.target.classList.add('vis'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: .07 });

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
}, { threshold: .08 });

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
}, { threshold: .05 });

const sg = document.querySelector('.sgrid');
if (sg) servObserver.observe(sg);

/* ── TESTIMONIOS REVEAL ────────────────────────── */
const testObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.tc').forEach((card, i) =>
        setTimeout(() => card.classList.add('vis'), i * 130)
      );
      testObserver.disconnect();
    }
  });
}, { threshold: .05 });

const tg = document.querySelector('.tgrid');
if (tg) testObserver.observe(tg);

/* ── ACTIVE NAV LINK ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: .35 });

sections.forEach(s => sectionObserver.observe(s));

/* ── SMOOTH NAV LINKS ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.offsetHeight + 24;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── FORMULARIO → WHATSAPP ─────────────────────── */
document.getElementById('fBtn').addEventListener('click', function () {
  const name    = document.getElementById('fN').value.trim();
  const contact = document.getElementById('fC').value.trim();
  const service = document.getElementById('fS').value;
  const message = document.getElementById('fM').value.trim();

  if (!name) {
    const input = document.getElementById('fN');
    input.style.borderColor = 'rgba(240,82,82,0.7)';
    input.style.boxShadow   = '0 0 0 3px rgba(240,82,82,0.10)';
    input.focus();
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow   = '';
    }, 2500);
    return;
  }

  const text =
    `Hola Fernando 👋, vi su portafolio de Dyveron Tech.%0A%0A` +
    `*Nombre:* ${encodeURIComponent(name)}%0A` +
    `*Contacto:* ${encodeURIComponent(contact || '—')}%0A` +
    `*Servicio:* ${encodeURIComponent(service || 'Sin especificar')}%0A` +
    `*Mensaje:* ${encodeURIComponent(message || 'Sin mensaje adicional')}`;

  window.open(`https://wa.me/50432591982?text=${text}`, '_blank');
});

/* ── PARALLAX SUAVE EN ORBES ─────────────────────── */
if (!isMobile) {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.050;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
}
