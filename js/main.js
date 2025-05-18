/**
 * Main JavaScript file for Kamal Bura's portfolio
 * Enhanced with error handling, robustness improvements and aura effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Global error handling
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        // Prevent complete UI failure on script error
        return true;
    });

    // Feature detection and polyfills
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsLocalStorage = (function() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    })();
    
    // Preloader with failsafe
    const preloaderTimeout = setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000); // Failsafe timeout
    
    window.addEventListener('load', function() {
        clearTimeout(preloaderTimeout);
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
    
    // Initialize AOS animation library with error handling
    try {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out',
            disable: window.innerWidth < 768 ? 'phone' : false
        });
    } catch (e) {
        console.error('AOS initialization failed:', e);
    }
    
    // Typed.js Text Animation with error handling
    try {
        if(document.querySelector('.typed-text')) {
            let typed = new Typed('.typed-text', {
                strings: ['ML Enthusiast', 'Software Engineer', 'Problem Solver'],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true
            });
        }
    } catch (e) {
        console.error('Typed.js initialization failed:', e);
        
        // Fallback for typed text
        const typedElement = document.querySelector('.typed-text');
        if (typedElement) {
            typedElement.textContent = 'ML Enthusiast';
        }
    }
    
    // Initialize particles.js with error handling
    try {
        if(document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#00f3ff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00f3ff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'grab' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                }
            });
        }
    } catch (e) {
        console.error('Particles.js initialization failed:', e);
        
        // Add a simple fallback animation for the hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.classList.add('fallback-bg');
        }
    }
    
    // Enhanced Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if(navLinks && navLinks.classList.contains('active')) {
            if(!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
    
    // Enhanced smooth scrolling with fallback and better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if(navToggle) navToggle.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if(target) {
                // Use smooth scroll with fallback
                try {
                    // Calculate offset to account for fixed header
                    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } catch (e) {
                    // Fallback for older browsers
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo(0, targetPosition);
                }
                
                // Update URL hash after scroll completes
                setTimeout(() => {
                    window.history.pushState(null, '', targetId);
                }, 1000);
            }
        });
    });
    
    // Scroll to top button visibility
    const backToTopButton = document.querySelector('.back-to-top');
    if(backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }
    
    // Project filtering with enhanced animations
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projectSearch = document.getElementById('project-search');
    
    if(categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                document.querySelector('.category-btn.active').classList.remove('active');
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterProjects(filter, projectSearch ? projectSearch.value : '');
            });
        });
    }
    
    // Project search functionality
    if(projectSearch) {
        projectSearch.addEventListener('input', function() {
            const activeFilter = document.querySelector('.category-btn.active').getAttribute('data-filter');
            filterProjects(activeFilter, this.value);
        });
    }
    
    // Function to filter projects by category and search term
    function filterProjects(category, searchTerm = '') {
        const projectCards = document.querySelectorAll('.project-card');
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            // Check category filter
            const matchesCategory = category === 'all' || card.getAttribute('data-category') === category;
            
            // Check search term
            const projectName = card.querySelector('h3').textContent.toLowerCase();
            const projectDesc = card.querySelector('p').textContent.toLowerCase();
            const projectTech = Array.from(card.querySelectorAll('.project-tech span'))
                .map(span => span.textContent.toLowerCase())
                .join(' ');
            
            const searchContent = `${projectName} ${projectDesc} ${projectTech}`;
            const matchesSearch = searchTerm === '' || searchContent.includes(searchTerm.toLowerCase());
            
            // Show/hide based on filters
            if(matchesCategory && matchesSearch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    visibleCount++;
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show/hide no results message
        const noResultsMessage = document.querySelector('.no-results-message');
        if (noResultsMessage) {
            if (visibleCount === 0) {
                setTimeout(() => {
                    noResultsMessage.style.display = 'block';
                }, 300);
            } else {
                noResultsMessage.style.display = 'none';
            }
        }
    }
    
    // Enhanced theme toggle with better transition effects
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Check for saved theme preference or use system preference as fallback
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = supportsLocalStorage ? (localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light')) : 'dark';
    
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    
    if (themeToggle && themeIcon) {
        // Update icon based on current theme
        if (savedTheme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', function() {
            // Add transition class for smooth theme switch
            document.body.classList.add('theme-transition');
            
            // Toggle theme
            document.body.classList.toggle('light-mode');
            
            // Update icon with animation
            if (document.body.classList.contains('light-mode')) {
                themeIcon.classList.add('spin-animation');
                setTimeout(() => {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    themeIcon.classList.remove('spin-animation');
                }, 150);
                
                if(supportsLocalStorage) {
                    localStorage.setItem('theme', 'light');
                }
            } else {
                themeIcon.classList.add('spin-animation');
                setTimeout(() => {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    themeIcon.classList.remove('spin-animation');
                }, 150);
                
                if(supportsLocalStorage) {
                    localStorage.setItem('theme', 'dark');
                }
            }
            
            // Remove transition class after theme switch is complete
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
        });
    }
    
    // Hero image enhanced effects
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        // Add loading attribute for browsers that support it
        heroImage.loading = 'eager';
        
        // Better fade-in effect
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(20px)';
        heroImage.style.transition = 'opacity 0.6s ease-out, transform 0.8s ease-out';
        
        // Add error handler
        heroImage.onerror = () => {
            heroImage.src = 'img/fallback-hero.png';
            heroImage.classList.add('error');
        };
        
        // Fade in the image when loaded
        heroImage.onload = () => {
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateY(0)';
            }, 300);
        };
        
        // Force load if it takes too long
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0)';
        }, 1000);
        
        // Add subtle floating effect
        const heroImageContainer = document.querySelector('.hero-image');
        if (heroImageContainer) {
            heroImageContainer.classList.add('floating-container');
        }
    }
    
    // Enhanced form validation 
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');
    
    if(contactForm) {
        // Add field validation
        const validateField = (field) => {
            const value = field.value.trim();
            const formGroup = field.closest('.form-group');
            const errorElement = formGroup.querySelector('.form-error-message') || document.createElement('div');
            
            if (!errorElement.classList.contains('form-error-message')) {
                errorElement.className = 'form-error-message';
                formGroup.appendChild(errorElement);
            }
            
            let isValid = true;
            
            // Basic validation based on field type
            if (value === '') {
                errorElement.textContent = 'This field is required';
                isValid = false;
            } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
                errorElement.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Toggle error class
            formGroup.classList.toggle('has-error', !isValid);
            
            return isValid;
        };
        
        // Validate on blur
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', function() {
                // Remove error when user starts typing
                this.closest('.form-group').classList.remove('has-error');
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isFormValid = true;
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                // Focus first invalid field
                contactForm.querySelector('.has-error input, .has-error textarea').focus();
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            contactForm.style.opacity = '0.7';
            
            // Simulate form submission (replace with actual AJAX call in production)
            setTimeout(() => {
                contactForm.style.opacity = '1';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Show success message with animation
                successMessage.style.display = 'flex';
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                // Save form data to localStorage for recovery
                try {
                    if (supportsLocalStorage) {
                        const formData = {
                            name: document.getElementById('name').value,
                            email: document.getElementById('email').value,
                            subject: document.getElementById('subject').value,
                            message: document.getElementById('message').value,
                        };
                        localStorage.setItem('contactFormBackup', JSON.stringify(formData));
                    }
                } catch (e) {
                    console.error('Failed to save form data:', e);
                }
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 300);
                }, 5000);
            }, 1500);
        });
        
        // Check for saved form data on page load
        try {
            if (supportsLocalStorage) {
                const savedForm = localStorage.getItem('contactFormBackup');
                if (savedForm) {
                    const formData = JSON.parse(savedForm);
                    Object.keys(formData).forEach(key => {
                        const field = document.getElementById(key);
                        if (field) field.value = formData[key];
                    });
                }
            }
        } catch (e) {
            console.error('Failed to restore form data:', e);
        }
    }
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 600) {
                heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
            }
        });
    }
    
    // Add subtle hover effects to projects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ===== CONTACT FORM MICRO-INTERACTIONS =====
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('contactForm');
      if (!form) return;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      const status = document.querySelector('.form-status');
      const successMsg = status?.querySelector('.success-message');
      const errorMsg = status?.querySelector('.error-message');
      const sendBtn = form.querySelector('.send-btn');

      function validateEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }

      function showError(input, msg) {
        const err = input.parentElement.querySelector('.form-error-message');
        if (err) err.textContent = msg;
        input.classList.add('error');
      }
      function clearError(input) {
        const err = input.parentElement.querySelector('.form-error-message');
        if (err) err.textContent = '';
        input.classList.remove('error');
      }

      [name, email, subject, message].forEach(input => {
        input.addEventListener('input', () => clearError(input));
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        if (!name.value.trim()) { showError(name, 'Name is required'); valid = false; }
        if (!email.value.trim() || !validateEmail(email.value)) { showError(email, 'Valid email required'); valid = false; }
        if (!subject.value.trim()) { showError(subject, 'Subject is required'); valid = false; }
        if (!message.value.trim()) { showError(message, 'Message is required'); valid = false; }
        if (!valid) return;

        // Animate send button
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
          form.reset();
          if (successMsg) {
            successMsg.style.display = 'flex';
            setTimeout(() => { successMsg.style.display = 'none'; }, 3500);
          }
        }, 1200);
      });
    });
});
