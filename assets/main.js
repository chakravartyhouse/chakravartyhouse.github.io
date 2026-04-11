// ===== MAIN JAVASCRIPT =====

// Theme Management
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });

    this.setupThemeToggle();
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update button text
      themeToggle.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });

    // Set initial button text
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

// Mobile Menu Management
class MobileMenu {
  constructor() {
    this.init();
  }

  init() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.nav = document.querySelector('.nav');
    
    if (!this.menuToggle || !this.nav) return;

    this.setupMenuToggle();
    this.setupNavLinkHandling();
  }

  setupMenuToggle() {
    this.menuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.menuToggle.contains(e.target) && !this.nav.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  setupNavLinkHandling() {
    const navLinks = this.nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }

  toggleMenu() {
    this.menuToggle.classList.toggle('active');
    this.nav.classList.toggle('active');
  }

  closeMenu() {
    this.menuToggle.classList.remove('active');
    this.nav.classList.remove('active');
  }
}

// App Filtering System
class AppFilter {
  constructor() {
    this.init();
  }

  init() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.appCards = document.querySelectorAll('.app-card');
    
    if (!this.filterButtons.length || !this.appCards.length) return;

    this.setupFilterButtons();
    this.setupActiveState();
  }

  setupFilterButtons() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        this.filterApps(category);
        this.updateActiveButton(button);
      });
    });
  }

  setupActiveState() {
    // Set initial active state based on URL hash or default to 'all'
    const hash = window.location.hash.slice(1);
    const initialCategory = hash || 'all';
    
    const initialButton = document.querySelector(`[data-category="${initialCategory}"]`);
    if (initialButton) {
      this.updateActiveButton(initialButton);
      this.filterApps(initialCategory);
    }
  }

  filterApps(category) {
    this.appCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
        // Add fade-in animation
        setTimeout(() => {
          card.classList.add('fade-in');
        }, 50);
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });

    // Update URL hash
    if (category !== 'all') {
      window.history.pushState(null, null, `#${category}`);
    } else {
      window.history.pushState(null, null, window.location.pathname);
    }
  }

  updateActiveButton(activeButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    activeButton.classList.add('active');
  }
}

// Header Scroll Effects
class HeaderScroll {
  constructor() {
    this.init();
  }

  init() {
    this.header = document.querySelector('.header');
    if (!this.header) return;

    this.lastScrollTop = 0;
    this.setupScrollListener();
  }

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      this.lastScrollTop = scrollTop;
    });
  }
}

// Policy Page ScrollSpy
class PolicyScrollSpy {
  constructor() {
    this.init();
  }

  init() {
    this.policyNavLinks = document.querySelectorAll('.policy-nav-link');
    this.policySections = document.querySelectorAll('.policy-content h2, .policy-content h3');
    
    if (!this.policyNavLinks.length || !this.policySections.length) return;

    this.setupScrollListener();
    this.setupNavLinkHandling();
  }

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.updateActiveNavLink();
    });
  }

  setupNavLinkHandling() {
    this.policyNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 100;
    
    this.policySections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.policy-nav-link[href="#${sectionId}"]`);
        
        if (correspondingLink) {
          this.policyNavLinks.forEach(link => {
            link.classList.remove('active');
          });
          correspondingLink.classList.add('active');
        }
      }
    });
  }
}

// Smooth Scrolling for Anchor Links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if it's just "#" or if it's a policy nav link (handled by PolicyScrollSpy)
        if (href === '#' || link.classList.contains('policy-nav-link')) {
          return;
        }
        
        e.preventDefault();
        
        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Form Validation (for future contact forms)
class FormValidator {
  constructor() {
    this.init();
  }

  init() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      this.setupFormValidation(form);
    });
  }

  setupFormValidation(form) {
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Min/Max length validation
    if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
      isValid = false;
      errorMessage = `Minimum length is ${field.getAttribute('minlength')} characters`;
    }

    if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
      isValid = false;
      errorMessage = `Maximum length is ${field.getAttribute('maxlength')} characters`;
    }

    this.showFieldError(field, errorMessage);
    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    if (message) {
      field.classList.add('error');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      
      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// Image Lazy Loading
class LazyLoader {
  constructor() {
    this.init();
  }

  init() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver(lazyImages);
    } else {
      this.setupFallback(lazyImages);
    }
  }

  setupIntersectionObserver(images) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  setupFallback(images) {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      this.loadImage(img);
    });
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }
}

// Analytics and Performance Monitoring
class Analytics {
  constructor() {
    this.init();
  }

  init() {
    // Track page views
    this.trackPageView();
    
    // Track button clicks
    this.setupClickTracking();
    
    // Track performance metrics
    this.trackPerformance();
  }

  trackPageView() {
    // This would integrate with Google Analytics or similar
    // For now, just log to console for development
    console.log('Page view:', window.location.pathname);
  }

  setupClickTracking() {
    const trackableElements = document.querySelectorAll('[data-track]');
    
    trackableElements.forEach(element => {
      element.addEventListener('click', () => {
        const eventName = element.getAttribute('data-track');
        console.log('Track event:', eventName);
      });
    });
  }

  trackPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          console.log('Page load time:', loadTime + 'ms');
        }, 0);
      });
    }
  }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new MobileMenu();
  new AppFilter();
  new HeaderScroll();
  new PolicyScrollSpy();
  new SmoothScroll();
  new FormValidator();
  new LazyLoader();
  new Analytics();
});

// Handle browser back/forward buttons for app filtering
window.addEventListener('popstate', () => {
  const hash = window.location.hash.slice(1);
  const appFilter = new AppFilter();
  
  if (hash) {
    const button = document.querySelector(`[data-category="${hash}"]`);
    if (button) {
      appFilter.filterApps(hash);
      appFilter.updateActiveButton(button);
    }
  } else {
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) {
      appFilter.filterApps('all');
      appFilter.updateActiveButton(allButton);
    }
  }
});

// Export classes for potential use in other scripts
window.ChakravartyHouse = {
  ThemeManager,
  MobileMenu,
  AppFilter,
  HeaderScroll,
  PolicyScrollSpy,
  SmoothScroll,
  FormValidator,
  LazyLoader,
  Analytics
};
