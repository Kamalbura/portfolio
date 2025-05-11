/**
 * Main JavaScript file for Kamal Bura's portfolio
 * Enhanced with modern interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.classList.add('fade');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
    
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });
    
    // Typed.js Text Animation
    if(document.querySelector('.typed-text')) {
        let typed = new Typed('.typed-text', {
            strings: ['ML Enthusiast', 'Software Engineer', 'Problem Solver'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }
    
    // Initialize particles.js
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
    
    // Mobile Navigation Toggle
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
    
    // Handle nav link clicks and smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
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
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    
    if (themeToggle && themeIcon) {
        // Update icon based on current theme
        if (savedTheme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', function() {
            // Toggle theme
            document.body.classList.toggle('light-mode');
            
            // Update icon
            if (document.body.classList.contains('light-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver support
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    
    if(testimonialCards.length > 0) {
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach(card => card.style.display = 'none');
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            
            testimonialCards[index].style.display = 'block';
            testimonialDots[index].classList.add('active');
            currentIndex = index;
        }
        
        // Initialize
        showTestimonial(0);
        
        // Dot navigation
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });
        
        // Next/Prev buttons
        if(nextButton) {
            nextButton.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if(nextIndex >= testimonialCards.length) nextIndex = 0;
                showTestimonial(nextIndex);
            });
        }
        
        if(prevButton) {
            prevButton.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if(prevIndex < 0) prevIndex = testimonialCards.length - 1;
                showTestimonial(prevIndex);
            });
        }
        
        // Auto rotate
        setInterval(() => {
            let nextIndex = currentIndex + 1;
            if(nextIndex >= testimonialCards.length) nextIndex = 0;
            showTestimonial(nextIndex);
        }, 5000);
    }

    // Hero image styling fix
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
        heroImg.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        heroImg.style.opacity = '0';
        setTimeout(() => heroImg.style.opacity = '1', 200);
        // remove tilt listeners if added previously
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulating form submission
            contactForm.style.opacity = '0.5';
            
            setTimeout(() => {
                contactForm.style.opacity = '1';
                successMessage.style.display = 'flex';
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
});
