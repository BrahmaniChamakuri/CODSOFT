// Mobile nav toggle
function toggleMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}

// Contact form
function sendMsg(e) {
  e.preventDefault();
  const msg = document.getElementById('sent-msg');
  msg.classList.add('show');
  e.target.reset();
  setTimeout(() => msg.classList.remove('show'), 4000);
}

// Skill bar animation on scroll
const bars = document.querySelectorAll('.skill-bar');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.w + '%';
    }
  });
}, { threshold: 0.3 });
bars.forEach(bar => observer.observe(bar));

// Navbar solid on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.background = window.scrollY > 50
    ? 'rgba(15,14,23,0.99)'
    : 'rgba(15,14,23,0.95)';
});