// Scroll-based navbar
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.background = window.scrollY > 50
    ? 'rgba(7,9,15,0.99)'
    : 'rgba(7,9,15,0.92)';
});

// Animate cards on scroll
const cards = document.querySelectorAll('.feat-card, .review-card, .price-card, .step');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => {
  c.style.opacity = '0';
  c.style.transform = 'translateY(20px)';
  c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  obs.observe(c);
});