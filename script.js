/* ============================================================
   PORTFOLIO JAVASCRIPT - Advanced Edition
   ============================================================ */

'use strict';

// ── Utilities ──────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ── Footer Year ────────────────────────────────────────────
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Custom Cursor ──────────────────────────────────────────
if (!isTouchDevice) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: mouse.x, y: mouse.y };

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0)`;
    });

    (function renderRing() {
        ringPos.x += (mouse.x - ringPos.x) * 0.14;
        ringPos.y += (mouse.y - ringPos.y) * 0.14;
        ring.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
        requestAnimationFrame(renderRing);
    })();

    $$('.hover-target, a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('hovering');
            dot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('hovering');
            dot.style.opacity = '1';
        });
    });
}

// ── Hamburger / Mobile Menu ────────────────────────────────
const hamburger = $('#hamburger');
const mobileMenu = $('#mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

$$('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ── Navbar Scroll + Spy ────────────────────────────────────
const navbar = $('#navbar');
const navItems = $$('.nav-item');
const sections = $$('section');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 220) current = s.id;
    });
    navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
}, { passive: true });

// ── Typewriter ─────────────────────────────────────────────
const phrases = [
    'I build digital reality.',
    'I engineer user experiences.',
    'I craft interactive code.',
    'I design the future web.'
];
const typeEl = $('#typewriter');
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
    const phrase = phrases[phraseIdx];
    typeEl.textContent = phrase.substring(0, deleting ? charIdx - 1 : charIdx + 1);
    deleting ? charIdx-- : charIdx++;

    let delay = deleting ? 35 : 75;
    if (!deleting && charIdx === phrase.length) { delay = 2000; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 500; }

    setTimeout(typeEffect, delay);
}
setTimeout(typeEffect, 1000);

// ── Scroll Reveal ──────────────────────────────────────────
const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);

            // Trigger skill bars if inside skills section
            if (entry.target.closest('#skills')) {
                entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                    fill.style.width = fill.dataset.width + '%';
                });
            }
        }
    });
}, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

$$('.fade-up').forEach(el => revealObs.observe(el));

// Animate skill bars when section itself comes into view
const skillsSection = $('#skills');
if (skillsSection) {
    const skillObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                $$('.skill-fill').forEach(fill => { fill.style.width = fill.dataset.width + '%'; });
                skillObs.disconnect();
            }
        });
    }, { threshold: 0.2 });
    skillObs.observe(skillsSection);
}

// ── Counter Animation ──────────────────────────────────────
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            $$('.stat-num').forEach(el => {
                const target = parseInt(el.dataset.target);
                let count = 0;
                const step = Math.ceil(target / 40);
                const interval = setInterval(() => {
                    count = Math.min(count + step, target);
                    el.textContent = count;
                    if (count >= target) clearInterval(interval);
                }, 40);
            });
            counterObs.disconnect();
        }
    });
}, { threshold: 0.5 });

const heroStats = $('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

// ── Magnetic Buttons ───────────────────────────────────────
$$('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.3;
        const dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate3d(${dx}px,${dy}px,0)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ── 3D Tilt on Project Cards ───────────────────────────────
if (!isTouchDevice) {
    $$('[data-3d-tilt]').forEach(card => {
        const inner = card.querySelector('.project-card-inner');
        card.addEventListener('mouseenter', () => { inner.style.transition = 'none'; });
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const rotX = ((y - r.height / 2) / r.height) * -14;
            const rotY = ((x - r.width / 2) / r.width) * 14;
            inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            inner.style.transition = 'transform 0.6s cubic-bezier(0.25,1,0.5,1)';
            inner.style.transform = 'rotateX(0)rotateY(0)scale3d(1,1,1)';
        });
    });
}

// ── Contact Form ───────────────────────────────────────────
const form = $('#contactForm');
const success = $('#formSuccess');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit');
        btn.textContent = 'Sending…';
        btn.disabled = true;

        // Simulate send
        setTimeout(() => {
            form.reset();
            btn.textContent = 'Send Message →';
            btn.disabled = false;
            success.classList.add('show');
            setTimeout(() => success.classList.remove('show'), 5000);
        }, 1500);
    });
}

// ── Particle Canvas ────────────────────────────────────────
(function initCanvas() {
    const canvas = $('#particle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const CONFIG = {
        maxDist: 140,
        mouseDist: 180,
        color: '0,240,255',
        count: () => Math.min(Math.floor((W * H) / 11000), 120)
    };

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.r = Math.random() * 1.5 + 0.8;
        }
        update(mouse) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;

            if (!isTouchDevice && mouse) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < CONFIG.mouseDist && d > 0) {
                    const f = (CONFIG.mouseDist - d) / CONFIG.mouseDist;
                    this.x += (dx / d) * f * 2;
                    this.y += (dy / d) * f * 2;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${CONFIG.color},0.55)`;
            ctx.fill();
        }
    }

    function init() {
        particles = Array.from({ length: CONFIG.count() }, () => new Particle());
    }

    let mouse = null;
    if (!isTouchDevice) {
        window.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => p.update(mouse));

        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.hypot(dx, dy);
                if (d < CONFIG.maxDist) {
                    const op = (1 - d / CONFIG.maxDist) * 0.2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${CONFIG.color},${op})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

    resize();
    init();
    animate();
})();
