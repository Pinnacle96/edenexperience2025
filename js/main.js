// Utility to handle errors
const handleError = (message, error) => {
    console.error(`${message}:`, error);
  };
  
  // Countdown Timer
  const initCountdown = () => {
    const weddingDate = new Date('June 7, 2025 14:00:00').getTime();
    const countdownElement = document.getElementById('countdown');
  
    if (!countdownElement) {
      handleError('Countdown element not found');
      return;
    }
  
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
  
      if (distance < 0) {
        clearInterval(timer);
        countdownElement.innerHTML = '<span class="text-rose-200">We Are Married!</span>';
        return;
      }
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      countdownElement.innerHTML = `
        <span class="flex flex-col items-center">
          <span class="font-bold">${days}</span>
          <span class="text-xs sm:text-sm text-amber-200">Days</span>
        </span>
        <span class="text-amber-200">:</span>
        <span class="flex flex-col items-center">
          <span class="font-bold">${hours}</span>
          <span class="text-xs sm:text-sm text-amber-200">Hours</span>
        </span>
        <span class="text-amber-200">:</span>
        <span class="flex flex-col items-center">
          <span class="font-bold">${minutes}</span>
          <span class="text-xs sm:text-sm text-amber-200">Minutes</span>
        </span>
        <span class="text-amber-200">:</span>
        <span class="flex flex-col items-center">
          <span class="font-bold">${seconds}</span>
          <span class="text-xs sm:text-sm text-amber-200">Seconds</span>
        </span>
      `;
    };
  
    updateTimer(); // Initial call to avoid 1-second delay
    const timer = setInterval(updateTimer, 1000);
  };
  
  // Copy Account Number Function
  const copyAccount = async (accountNumber) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-rose-600 text-white px-4 py-2 rounded shadow-lg text-sm sm:text-base';
      toast.textContent = 'Account number copied!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (err) {
      handleError('Error copying account number', err);
    }
  };
  
  // Dynamic Date for Footer
  const initDynamicDate = () => {
    const dynamicDateElement = document.getElementById('dynamic-date');
    if (!dynamicDateElement) {
      handleError('Dynamic date element not found');
      return;
    }
  
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    dynamicDateElement.textContent = `${month} ${year}`;
  };
  
  // HTML Include Loader (Unused in current HTML)
  const loadIncludes = async () => {
    const includes = document.querySelectorAll('[data-include]');
    const loadPromises = Array.from(includes).map(async (el) => {
      const file = el.getAttribute('data-include');
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        el.innerHTML = await response.text();
        el.dispatchEvent(new Event('include-loaded'));
      } catch (err) {
        handleError(`Error loading ${file}`, err);
        el.innerHTML = `<p class="text-red-600">Error loading content</p>`;
      }
    });
    await Promise.all(loadPromises);
  };
  
  // Navigation Handler
  const initNavigation = () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuOpen = document.querySelector('.menu-open');
    const menuClose = document.querySelector('.menu-close');
  
    if (!menuToggle || !navMenu) {
      handleError('Navigation elements not found');
      return;
    }
  
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('hidden');
      menuOpen.classList.toggle('hidden');
      menuClose.classList.toggle('hidden');
    });
  
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (!navMenu.classList.contains('hidden')) {
            navMenu.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuOpen.classList.remove('hidden');
            menuClose.classList.add('hidden');
          }
        }
      });
    });
  
    // Reset mobile menu on resize
    const handleResize = () => {
      if (window.innerWidth >= 768 && !navMenu.classList.contains('hidden')) {
        navMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuOpen.classList.remove('hidden');
        menuClose.classList.add('hidden');
      }
    };
  
    // Debounce resize event
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    });
  };
  
  // Lightbox for Gallery
  const initLightbox = () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
  
    const createLightbox = (index) => {
      currentIndex = index;
      const item = galleryItems[index];
      const imgSrc = item.querySelector('img').src;
      const imgAlt = item.querySelector('img').alt;
  
      const lightbox = document.createElement('div');
      lightbox.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
      lightbox.setAttribute('data-motion', 'lightbox');
      lightbox.innerHTML = `
        <div class="relative w-full max-w-3xl sm:max-w-4xl h-full flex items-center justify-center">
          <button class="absolute top-2 sm:top-4 right-2 sm:right-4 text-amber-50 text-2xl sm:text-4xl hover:text-rose-300 transition-colors" id="close-lightbox">×</button>
          <button class="absolute left-2 sm:left-4 text-amber-50 text-2xl sm:text-4xl hover:text-rose-300 transition-colors" id="prev-lightbox">←</button>
          <button class="absolute right-2 sm:right-4 text-amber-50 text-2xl sm:text-4xl hover:text-rose-300 transition-colors" id="next-lightbox">→</button>
          <img src="${imgSrc}" alt="${imgAlt}" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg" id="lightbox-image">
        </div>
      `;
      document.body.appendChild(lightbox);
  
      // Animate lightbox opening
      if (window.motion) {
        const { motion } = window.motion;
        motion(lightbox, {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3, ease: 'easeOut' },
        });
      }
  
      // Close lightbox
      document.getElementById('close-lightbox').addEventListener('click', () => {
        lightbox.remove();
      });
  
      // Navigate previous
      const prevBtn = document.getElementById('prev-lightbox');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
          updateLightboxImage(lightbox, currentIndex);
        });
      }
  
      // Navigate next
      const nextBtn = document.getElementById('next-lightbox');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % galleryItems.length;
          updateLightboxImage(lightbox, currentIndex);
        });
      }
  
      // Keyboard navigation
      const handleKeydown = (e) => {
        if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
          updateLightboxImage(lightbox, currentIndex);
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % galleryItems.length;
          updateLightboxImage(lightbox, currentIndex);
        } else if (e.key === 'Escape') {
          lightbox.remove();
        }
      };
      document.addEventListener('keydown', handleKeydown);
  
      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) {
          currentIndex = (currentIndex + 1) % galleryItems.length;
          updateLightboxImage(lightbox, currentIndex);
        } else if (touchEndX > touchStartX + 50) {
          currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
          updateLightboxImage(lightbox, currentIndex);
        }
      });
  
      // Close on background click
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.remove();
        }
      });
  
      // Clean up
      lightbox.addEventListener('remove', () => {
        document.removeEventListener('keydown', handleKeydown);
      });
    };
  
    const updateLightboxImage = (lightbox, index) => {
      const item = galleryItems[index];
      const imgSrc = item.querySelector('img').src;
      const imgAlt = item.querySelector('img').alt;
      const lightboxImage = lightbox.querySelector('#lightbox-image');
  
      if (window.motion) {
        const { motion } = window.motion;
        motion(lightboxImage, {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.3, ease: 'easeOut' },
        });
      }
  
      lightboxImage.src = imgSrc;
      lightboxImage.alt = imgAlt;
    };
  
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => createLightbox(index));
    });
  };
  
  // Framer Motion Animations
  const initAnimations = () => {
    if (!window.motion) {
      handleError('Framer Motion not loaded');
      return;
    }
  
    const { motion } = window.motion;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    const animationConfig = (delay, duration) => ({
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: {
        duration: reducedMotion ? 0 : duration,
        ease: 'easeOut',
        delay: reducedMotion ? 0 : delay,
      },
    });
  
    // Animate header
    motion('header', {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: reducedMotion ? 0 : 0.8, ease: 'easeOut' },
    });
  
    // Animate nav links
    document.querySelectorAll("[data-motion='nav-link']").forEach((link, index) => {
      motion(link, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          delay: reducedMotion ? 0 : index * 0.05,
          duration: reducedMotion ? 0 : 0.5,
          ease: 'easeOut',
        },
      });
    });
  
    // Animate hero section
    motion("[data-motion='hero-title']", animationConfig(0, 1));
    document.querySelectorAll("[data-motion='hero-subtitle']").forEach((el, index) => {
      motion(el, animationConfig(0.2 + index * 0.05, 0.8));
    });
    motion("[data-motion='hero-date']", animationConfig(0.4, 0.8));
    motion("[data-motion='hero-countdown']", {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        delay: reducedMotion ? 0 : 0.6,
        duration: reducedMotion ? 0 : 0.8,
        ease: 'easeOut',
      },
    });
    motion("[data-motion='hero-cta']", animationConfig(0.8, 0.8));
  
    // Animate welcome section
    motion("[data-motion='welcome-section']", animationConfig(0, 0.8));
    motion("[data-motion='welcome-title']", animationConfig(0.2, 0.8));
    document.querySelectorAll("[data-motion='welcome-line']").forEach((line, index) => {
      motion(line, animationConfig(0.4 + index * 0.05, 0.6));
    });
  
    // Animate about section
    motion("[data-motion='about-section']", animationConfig(0, 0.8));
    motion("[data-motion='about-title']", animationConfig(0.2, 0.8));
    document.querySelectorAll("[data-motion='about-text']").forEach((text, index) => {
      motion(text, animationConfig(0.4 + index * 0.05, 0.6));
    });
  
    // Animate gallery section
    motion("[data-motion='gallery-section']", animationConfig(0, 0.8));
    motion("[data-motion='gallery-title']", animationConfig(0.2, 0.8));
    document.querySelectorAll("[data-motion='gallery-image']").forEach((image, index) => {
      motion(image, {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: '-100px' },
        transition: {
          delay: reducedMotion ? 0 : 0.4 + index * 0.05,
          duration: reducedMotion ? 0 : 0.6,
          ease: 'easeOut',
        },
      });
    });
  
    // Animate info section
    motion("[data-motion='info-section']", animationConfig(0, 0.8));
    motion("[data-motion='info-title']", animationConfig(0.2, 0.8));
    document.querySelectorAll("[data-motion='info-item']").forEach((item, index) => {
      motion(item, animationConfig(0.4 + index * 0.05, 0.6));
    });
  
    // Animate RSVP section
    motion("[data-motion='rsvp-section']", animationConfig(0, 0.8));
    motion("[data-motion='rsvp-title']", animationConfig(0.2, 0.8));
    motion("[data-motion='rsvp-invitation']", {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true, margin: '-100px' },
      transition: {
        delay: reducedMotion ? 0 : 0.3,
        duration: reducedMotion ? 0 : 0.8,
        ease: 'easeOut',
      },
    });
  
    // Animate Support section
    motion("[data-motion='support-section']", animationConfig(0, 0.8));
    motion("[data-motion='support-title']", animationConfig(0.2, 0.8));
    motion("[data-motion='support-message']", animationConfig(0.3, 0.8));
    document.querySelectorAll("[data-motion='support-item']").forEach((item, index) => {
      motion(item, animationConfig(0.4 + index * 0.05, 0.6));
    });
  
    // Animate Footer section
    motion("[data-motion='footer-section']", {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-50px' },
      transition: {
        duration: reducedMotion ? 0 : 0.6,
        ease: 'easeOut',
      },
    });
  };
  
  // Initialize Everything
  const init = async () => {
    await loadIncludes(); // Load components first
    initNavigation();
    initAnimations();
    initCountdown();
    initLightbox();
    initDynamicDate();
  };
  
  document.addEventListener('DOMContentLoaded', init);
  
  // Expose copyAccount globally
  window.copyAccount = copyAccount;