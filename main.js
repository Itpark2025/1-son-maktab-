/* ============================================
   1-SON MAKTAB — INTERACTIVE FEATURES
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavbar();
  initSlider();
  initScrollReveal();
  initTabs();
  initCounters();
  initLightbox();
  initForms();
  initScrollTop();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
}

/* ============================================
   HERO SLIDER
   ============================================ */
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;
  let interval;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(interval);
    startAutoplay();
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
  });

  // Arrow navigation
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  // Start
  goToSlide(0);
  startAutoplay();
}

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   TABS (Students Section)
   ============================================ */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
    }

    requestAnimationFrame(update);
  }
}

/* ============================================
   LIGHTBOX GALLERY
   ============================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      images.push(img.src);
      item.addEventListener('click', () => {
        currentIndex = i;
        openLightbox();
      });
    }
  });

  function openLightbox() {
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ============================================
   FORM VALIDATION
   ============================================ */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Validate required fields
      form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('error');
          group.querySelector('.error-msg').textContent = 'Bu maydon to\'ldirilishi shart';
          isValid = false;
        }
      });

      // Validate email
      const emailField = form.querySelector('[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          const group = emailField.closest('.form-group');
          group.classList.add('error');
          group.querySelector('.error-msg').textContent = 'Email manzil noto\'g\'ri kiritildi';
          isValid = false;
        }
      }

      // Validate phone
      const phoneField = form.querySelector('[type="tel"]');
      if (phoneField && phoneField.value.trim()) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(phoneField.value)) {
          const group = phoneField.closest('.form-group');
          group.classList.add('error');
          group.querySelector('.error-msg').textContent = 'Telefon raqam noto\'g\'ri kiritildi';
          isValid = false;
        }
      }

      if (isValid) {
        // Show success message
        const formContent = form.querySelector('.form-fields');
        const successMsg = form.querySelector('.form-success');
        if (formContent && successMsg) {
          formContent.style.display = 'none';
          successMsg.classList.add('show');

          // Reset after 3 seconds
          setTimeout(() => {
            form.reset();
            formContent.style.display = 'block';
            successMsg.classList.remove('show');
          }, 3000);
        }
      }
    });
  });
}

/* ============================================
   SCROLL TO TOP BUTTON
   ============================================ */
function initScrollTop() {
  const scrollBtn = document.querySelector('.scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
