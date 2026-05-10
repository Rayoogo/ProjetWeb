/* =============================================
   EFREI — Département Informatique
   main.js — Interactions & Animations
   ============================================= */

// ---- Nav Toggle (Mobile) ----
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// ---- Animated Stats Counter ----
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString('fr-FR');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
if (statNums.length > 0) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));
}

// ---- Testimonials ----
function showTestimonial(id) {
  document.querySelectorAll('.testimonial-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.t-dot').forEach(d => d.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  const idx = ['t1', 't2', 't3'].indexOf(id);
  const dots = document.querySelectorAll('.t-dot');
  if (dots[idx]) dots[idx].classList.add('active');
}

// Auto rotate testimonials
let tIdx = 0;
const tIds = ['t1', 't2', 't3'];
if (document.querySelector('.testimonials')) {
  setInterval(() => {
    tIdx = (tIdx + 1) % tIds.length;
    showTestimonial(tIds[tIdx]);
  }, 5000);
}

// ---- FAQ Accordion ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ---- Contact Form Validation ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showFormAlert('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormAlert('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    showFormAlert('Votre message a bien été envoyé ! Nous vous répondrons sous 48h.', 'success');
    contactForm.reset();
  });
}

function showFormAlert(msg, type) {
  let alert = document.getElementById('formAlert');
  if (!alert) {
    alert = document.createElement('div');
    alert.id = 'formAlert';
    contactForm.prepend(alert);
  }
  alert.textContent = msg;
  alert.style.cssText = `
    padding: 12px 16px; border-radius: 8px; margin-bottom: 1.25rem;
    font-size: 0.875rem; font-weight: 500;
    background: ${type === 'success' ? '#dcfce7' : '#fee2e2'};
    color: ${type === 'success' ? '#166534' : '#991b1b'};
    border: 1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'};
  `;
  setTimeout(() => alert.remove(), 5000);
}

// ---- Scroll-reveal for cards ----
const revealEls = document.querySelectorAll('.prog-card, .news-card, .team-card, .campus-card, .club-card, .member-card');
if (revealEls.length > 0 && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeUp 0.5s ease ${i * 0.05}s both`;
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => {
    el.style.opacity = '0';
    revealObserver.observe(el);
  });
}

// ---- Active nav link highlight ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});


// Carousel
const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;

function showSlide(i){
    if(i >= images.length){
        index = 0;
    }
    else if(i < 0){
        index = images.length - 1;
    }
    else{
        index = i;
    }

    slides.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener('click', () => {
    showSlide(index + 1);
});

prevBtn.addEventListener('click', () => {
    showSlide(index - 1);
});

// Défilement automatique
setInterval(() => {
    showSlide(index + 1);
}, 5000);
