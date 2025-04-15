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
          <span class="text-xs text-amber-200">Days</span>
        </span>
        <span class="text-amber-200">:</span>
        <span class="flex flex-col items-center">
          <span class="font-bold">${hours}</span>
          <span class="text-xs text-amber-200">Hours</span>
        </span>
        <span class="text-amber-200">:</span>
        <span class="flex flex-col items-center">
          <span class="font-bold">${minutes}</span>
          <span class="text-xs text-amber-200">Minutes</span>
        </span>
        <span class="text-amber-200">:</span>
        <span class="flex flex-col items-center">
          <span class="font-bold">${seconds}</span>
          <span class="text-xs text-amber-200">Seconds</span>
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
      // Replace alert with a toast notification (customizable)
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-rose-600 text-white px-4 py-2 rounded shadow-lg';
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
  
  // HTML Include Loader
  const loadIncludes = async () => {
    const includes = document.querySelectorAll('[data-include]');
    const loadPromises = Array.from(includes).map(async (el) => {
      const file = el.getAttribute('data-include');
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        el.innerHTML = await response.text();
        // Trigger event for dynamic content (e.g., for other scripts)
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
          target.scrollIntoView({ behavior: 'smooth' });
          if (!navMenu.classList.contains('hidden')) {
            navMenu.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuOpen.classList.remove('hidden');
            menuClose.classList.add('hidden');
          }
        }
      });
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
        <div class="relative max-w-4xl w-full h-full flex items-center justify-center">
          <button class="absolute top-4 right-4 text-amber-50 text-3xl sm:text-4xl hover:text-rose-300 transition-colors" id="close-lightbox">×</button>
          <button class="absolute left-4 text-amber-50 text-3xl sm:text-4xl hover:text-rose-300 transition-colors hidden sm:block" id="prev-lightbox">←</button>
          <button class="absolute right-4 text-amber-50 text-3xl sm:text-4xl hover:text-rose-300 transition-colors hidden sm:block" id="next-lightbox">→</button>
          <img src="${imgSrc}" alt="${imgAlt}" class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" id="lightbox-image">
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
  
      // Remove keydown listener when lightbox closes
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.remove();
        }
      });
  
      lightbox.addEventListener('remove', () => {
        document.removeEventListener('keydown', handleKeydown);
      });
    };
  
    const updateLightboxImage = (lightbox, index) => {
      const item = galleryItems[index];
      const imgSrc = item.querySelector('img').src;
      const imgAlt = item.querySelector('img').alt;
      const lightboxImage = lightbox.querySelector('#lightbox-image');
  
      // Animate image transition
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
  
    // Animate header
    motion('header', {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    // Animate nav links
    document.querySelectorAll("[data-motion='nav-link']").forEach((link, index) => {
      motion(link, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' },
      });
    });
  
    // Animate hero section
    motion("[data-motion='hero-title']", {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 1, ease: 'easeOut' },
    });
  
    document.querySelectorAll("[data-motion='hero-subtitle']").forEach((el, index) => {
      motion(el, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 + index * 0.1, duration: 0.8, ease: 'easeOut' },
      });
    });
  
    motion("[data-motion='hero-date']", {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4, duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='hero-countdown']", {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: 0.6, duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='hero-cta']", {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.8, duration: 0.8, ease: 'easeOut' },
    });
  
    // Animate welcome section
    motion("[data-motion='welcome-section']", {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='welcome-title']", {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    });
  
    document.querySelectorAll("[data-motion='welcome-line']").forEach((line, index) => {
      motion(line, {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-100px' },
        transition: { delay: 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' },
      });
    });
  
    // Animate about section
    motion("[data-motion='about-section']", {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='about-title']", {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    });
  
    document.querySelectorAll("[data-motion='about-text']").forEach((text, index) => {
      motion(text, {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-100px' },
        transition: { delay: 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' },
      });
    });
  
    // Animate gallery section
    motion("[data-motion='gallery-section']", {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='gallery-title']", {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    });
  
    document.querySelectorAll("[data-motion='gallery-image']").forEach((image, index) => {
      motion(image, {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: '-100px' },
        transition: { delay: 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' },
      });
    });
  
    // Animate info section
    motion("[data-motion='info-section']", {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='info-title']", {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    });
  
    document.querySelectorAll("[data-motion='info-item']").forEach((item, index) => {
      motion(item, {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-100px' },
        transition: { delay: 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' },
      });
    });
  
    // Animate RSVP section
    motion("[data-motion='rsvp-section']", {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='rsvp-title']", {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    });
  
    motion("[data-motion='rsvp-invitation']", {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 },
    });
  
    motion("[data-motion='rsvp-form']", {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
    });
  
    // Animate Support section
    motion("[data-motion='support-section']", {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  
    motion("[data-motion='support-title']", {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
    });
  
    motion("[data-motion='support-message']", {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 },
    });
  
    document.querySelectorAll("[data-motion='support-item']").forEach((item, index) => {
      motion(item, {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-100px' },
        transition: { delay: 0.4 + index * 0.1, duration: 0.6, ease: 'easeOut' },
      });
    });
  
    // Animate Footer section
    motion("[data-motion='footer-section']", {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-50px' },
      transition: { duration: 0.6, ease: 'easeOut' },
    });
  
    // Future component animations can be added here
  };
  
  // Initialize Everything
  const init = async () => {
    await loadIncludes(); // Load components first
    initNavigation();
    initAnimations();
    initCountdown();
    initLightbox(); // Initialize lightbox for gallery
    initDynamicDate(); // Initialize dynamic date for footer
    // Add more initializations as components are enhanced
  };
  
  document.addEventListener('DOMContentLoaded', init);
  
  // Expose copyAccount globally for inline HTML calls
  window.copyAccount = copyAccount;