// ─── Scroll Reveal ──────────────────────────────
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
        if (siblings && siblings.length > 1) {
          const idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 100}ms`;
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

reveals.forEach((el) => observer.observe(el));

// ─── Smooth Nav Background ─────────────────────
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 100) {
    nav.style.background = 'rgba(5,5,5,0.85)';
  } else {
    nav.style.background = 'rgba(5,5,5,0.6)';
  }
  lastScroll = y;
}, { passive: true });
