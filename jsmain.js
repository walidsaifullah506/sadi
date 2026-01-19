// ============================================
// WALID SAIFULLAH - ETHICAL HACKER PORTFOLIO
// Main JavaScript File
// ============================================

// Preloader - Hide after 2.5 seconds
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }, 2500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll animation for cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.skill-card, .project-card, .cert-card, .tip-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// Active navigation link highlight
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.style.color = '#00ff88';
      link.style.textShadow = '0 0 10px #00ff88';
    } else {
      link.style.color = '#00cc66';
      link.style.textShadow = 'none';
    }
  });
});

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show message function
function showMessage(message, type = 'success') {
  const responseDiv = document.getElementById('response-message');
  if (responseDiv) {
    responseDiv.textContent = message;
    responseDiv.className = `response-message show ${type}`;
    setTimeout(() => {
      responseDiv.classList.remove('show');
    }, 3000);
  }
}

// Check if firebase is available
window.addEventListener('DOMContentLoaded', () => {
  console.log('✓ Portfolio loaded successfully');
  console.log('✓ Firebase SDK loaded: ', typeof firebase !== 'undefined');
  console.log('✓ EmailJS SDK loaded');
});
