/**
 * Personal Page JavaScript
 * Handles specific interactions for the personal life page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
        disable: window.innerWidth < 768 ? 'phone' : false
    });
    
    // Photo Gallery
    initializeGallery();
    
    // Map markers interactions
    initializeMapMarkers();
    
    // Theme toggle functionality (copied from main.js for consistency)
    initializeThemeToggle();
    
    // Navigation menu functionality
    initializeNavigationMenu();
    
    // Smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Preloader functionality
    const preloaderTimeout = setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1000);
    
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
    
    /**
     * Initialize the photo gallery functionality
     */
    function initializeGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const captionEl = document.getElementById('gallery-caption');
        
        if (galleryItems.length === 0) return;
        
        // Create overlay elements if they don't exist
        let overlay = document.querySelector('.gallery-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            
            const overlayContent = document.createElement('div');
            overlayContent.className = 'gallery-overlay-content';
            
            const overlayImg = document.createElement('img');
            const overlayCaption = document.createElement('div');
            overlayCaption.className = 'gallery-overlay-caption';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'gallery-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            overlayContent.appendChild(overlayImg);
            overlayContent.appendChild(overlayCaption);
            overlayContent.appendChild(closeBtn);
            overlay.appendChild(overlayContent);
            document.body.appendChild(overlay);
            
            // Close overlay
            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });
        }
        
        const overlayImg = overlay.querySelector('img');
        const overlayCaption = overlay.querySelector('.gallery-overlay-caption');
        
        galleryItems.forEach(item => {
            // Show caption on hover
            item.addEventListener('mouseenter', () => {
                const caption = item.getAttribute('data-caption');
                if (captionEl && caption) {
                    captionEl.textContent = caption;
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (captionEl) {
                    captionEl.textContent = 'Click an image to see details';
                }
            });
            
            // Open image in overlay
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.getAttribute('data-caption');
                
                if (overlayImg) overlayImg.src = img.src;
                if (overlayCaption) overlayCaption.textContent = caption || '';
                
                overlay.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }
    
    /**
     * Initialize map markers hover interactions
     */
    function initializeMapMarkers() {
        const markers = document.querySelectorAll('.map-marker');
        
        if (markers.length === 0) return;
        
        markers.forEach(marker => {
            // Add pulse animation
            marker.classList.add('pulse');
            
            // Randomize the animation delay for each marker
            const delay = Math.random() * 2;
            marker.style.animationDelay = `${delay}s`;
        });
    }
    
    /**
     * Initialize theme toggle functionality
     */
    function initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
        
        // Check for saved theme preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
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
                    
                    localStorage.setItem('theme', 'light');
                } else {
                    themeIcon.classList.add('spin-animation');
                    setTimeout(() => {
                        themeIcon.classList.remove('fa-sun');
                        themeIcon.classList.add('fa-moon');
                        themeIcon.classList.remove('spin-animation');
                    }, 150);
                    
                    localStorage.setItem('theme', 'dark');
                }
                
                // Remove transition class after theme switch is complete
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 500);
            });
        }
    }
    
    /**
     * Initialize navigation menu functionality
     */
    function initializeNavigationMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                if (navLinks) {
                    navLinks.classList.toggle('active');
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks && navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                    navLinks.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                }
            }
        });
    }
    
    /**
     * Initialize smooth scrolling for anchor links
     */
    function initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const navToggle = document.querySelector('.nav-toggle');
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                }
                
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Calculate offset to account for fixed header
                    const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Add CSS animation for map markers
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        .map-marker.pulse {
            animation: pulse 3s infinite ease-in-out;
        }
        
        .gallery-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 999;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }
        
        .gallery-overlay.active {
            display: flex;
        }
        
        .gallery-overlay-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .gallery-overlay img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 10px;
            border: 2px solid var(--primary-color);
            box-shadow: 0 0 30px var(--primary-glow);
        }
        
        .gallery-overlay-caption {
            color: var(--text-light);
            text-align: center;
            margin-top: 20px;
            font-size: 1.1rem;
        }
        
        .gallery-close {
            position: absolute;
            top: -40px;
            right: -40px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: var(--bg-darker);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            border: none;
            box-shadow: 0 0 15px var(--primary-glow);
        }
    `;
    document.head.appendChild(style);
});
