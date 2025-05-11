/**
 * Projects Loader
 * Dynamically loads projects from localStorage data with professional filtering,
 * sorting, animations, and interaction capabilities
 * 
 * @author Kamal Bura
 * @version 1.2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return;
    
    // State management for projects
    const state = {
        allProjects: [],
        filteredProjects: [],
        currentCategory: 'all',
        searchTerm: '',
        isLoading: true,
        sortOption: 'featured', // default sort option
    }
    
    /**
     * Load projects from localStorage or API
     * @returns {Promise} Projects data
     */
    async function loadProjects() {
        state.isLoading = true;
        renderLoadingState();
        
        try {
            // Simulate API loading delay (remove in production)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get projects data
            const projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
            
            // Set state
            state.allProjects = projects;
            state.filteredProjects = [...projects];
            
            // Sort and render projects
            sortProjects();
            renderProjects();
            initializeFilterListeners();
            
            // If no projects are available, show sample projects
            if (projects.length === 0) {
                loadSampleProjects();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            renderErrorState('Failed to load projects. Please try again.');
        } finally {
            state.isLoading = false;
        }
    }
    
    /**
     * Sort projects based on current sort option
     */
    function sortProjects() {
        state.filteredProjects.sort((a, b) => {
            // Featured projects come first if using 'featured' sort option
            if (state.sortOption === 'featured') {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
            }
            
            // Sort by date (newest first) if sort option is 'newest'
            if (state.sortOption === 'newest') {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            }
            
            // Sort alphabetically if sort option is 'name'
            if (state.sortOption === 'name') {
                return a.name.localeCompare(b.name);
            }
            
            return 0;
        });
    }
    
    /**
     * Filter projects based on category and search term
     */
    function filterProjects() {
        const { allProjects, currentCategory, searchTerm } = state;
        
        state.filteredProjects = allProjects.filter(project => {
            // Filter by category
            const categoryMatches = currentCategory === 'all' || project.category === currentCategory;
            
            // Filter by search term
            const searchContent = `${project.name} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
            const searchMatches = !searchTerm || searchContent.includes(searchTerm.toLowerCase());
            
            return categoryMatches && searchMatches;
        });
        
        sortProjects();
        renderProjects();
    }
    
    /**
     * Render loading state
     */
    function renderLoadingState() {
        projectsGrid.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner">
                    <div class="spinner-circle"></div>
                </div>
                <p>Loading projects...</p>
            </div>
        `;
    }
    
    /**
     * Render error state
     * @param {string} message - Error message to display
     */
    function renderErrorState(message) {
        projectsGrid.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <p>${message}</p>
                <button class="btn btn-primary retry-btn">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
        
        // Add retry event listener
        const retryBtn = projectsGrid.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', loadProjects);
        }
    }
    
    /**
     * Render projects to the grid
     */
    function renderProjects() {
        // Clear existing projects
        projectsGrid.innerHTML = '';
        
        if (state.filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-results-message">
                    <i class="fas fa-search"></i>
                    <p>No projects match your search criteria</p>
                    <button class="btn btn-outline clear-filters-btn">
                        Clear Filters
                    </button>
                </div>
            `;
            
            // Add clear filters event listener
            const clearFiltersBtn = projectsGrid.querySelector('.clear-filters-btn');
            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', () => {
                    state.currentCategory = 'all';
                    state.searchTerm = '';
                    
                    // Reset UI
                    const categoryBtns = document.querySelectorAll('.category-btn');
                    categoryBtns.forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
                    });
                    
                    const searchInput = document.getElementById('project-search');
                    if (searchInput) searchInput.value = '';
                    
                    filterProjects();
                });
            }
            return;
        }
        
        // Add projects to the grid with staggered animations
        state.filteredProjects.forEach((project, index) => {
            const projectCard = createProjectCard(project);
            projectCard.style.animationDelay = `${index * 0.1}s`;
            projectsGrid.appendChild(projectCard);
        });
        
        // Initialize lazy loading
        setTimeout(observeImages, 100);
    }
    
    /**
     * Create a project card element
     * @param {Object} project - Project data
     * @returns {HTMLElement} Project card element
     */
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card fade-in-up';
        
        if (project.featured) card.classList.add('featured-project');
        
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', '100');
        
        card.innerHTML = `
            <div class="project-image">
                <img data-src="${project.image || 'img/projects/default-project.jpg'}" 
                     src="img/placeholder.jpg" 
                     alt="${project.name}"
                     class="lazy-image"
                     onerror="this.src='img/projects/default-project.jpg'">
                ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                <div class="project-overlay">
                    ${project.live ? `<a href="${project.live}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Live Demo"><i class="fas fa-link"></i></a>` : ''}
                    ${project.github ? `<a href="${project.github}" class="project-github" target="_blank" rel="noopener noreferrer" aria-label="View Code on GitHub"><i class="fab fa-github"></i></a>` : ''}
                </div>
            </div>
            <div class="project-content">
                <span class="project-category">${getCategoryDisplayName(project.category)}</span>
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" class="btn btn-sm" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.caseStudy ? `<a href="${project.caseStudy}" class="btn btn-sm case-study-btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-file-alt"></i> Case Study</a>` : ''}
                    <button class="btn btn-sm details-btn" data-id="${project.id || ''}" aria-label="View Project Details"><i class="fas fa-info-circle"></i> Details</button>
                </div>
            </div>
        `;
        
        // Add event listener for the details button
        const detailsBtn = card.querySelector('.details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => showProjectDetails(project));
        }
        
        return card;
    }
    
    /**
     * Show project details in a modal
     * @param {Object} project - Project data
     */
    function showProjectDetails(project) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('project-details-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'project-details-modal';
            modal.className = 'modal project-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-labelledby', 'modal-project-title');
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-project-title"></h3>
                        <button class="modal-close" aria-label="Close modal">&times;</button>
                    </div>
                    <div class="modal-body" id="modal-project-content">
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add close functionality
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                // Enable body scroll when modal is closed
                document.body.classList.remove('modal-open');
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });
        }
        
        // Populate modal with project details
        const title = modal.querySelector('#modal-project-title');
        const content = modal.querySelector('#modal-project-content');
        
        title.textContent = project.name;
        
        // Project duration or date info
        const projectDate = project.date ? new Date(project.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        }) : '';
        
        const projectDuration = project.duration || '';
        const dateInfo = projectDate || projectDuration ? `
            <div class="project-details-date">
                ${projectDate ? `<span class="date-info"><i class="far fa-calendar-alt"></i> ${projectDate}</span>` : ''}
                ${projectDuration ? `<span class="duration-info"><i class="far fa-clock"></i> ${projectDuration}</span>` : ''}
            </div>
        ` : '';
        
        content.innerHTML = `
            <div class="project-details">
                <div class="project-details-image">
                    <img src="${project.image || 'img/projects/default-project.jpg'}" 
                         alt="${project.name}"
                         onerror="this.src='img/projects/default-project.jpg'">
                </div>
                <div class="project-details-content">
                    <div class="project-details-category">
                        <span class="category-badge">${getCategoryDisplayName(project.category)}</span>
                        ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    </div>
                    ${dateInfo}
                    <div class="project-details-description">
                        <h4>About This Project</h4>
                        <p>${project.description}</p>
                        ${project.challenge ? `
                        <h4>The Challenge</h4>
                        <p>${project.challenge}</p>
                        ` : ''}
                        ${project.solution ? `
                        <h4>The Solution</h4>
                        <p>${project.solution}</p>
                        ` : ''}
                    </div>
                    <div class="project-details-technologies">
                        <h4>Technologies</h4>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="project-details-links">
                        ${project.github ? `<a href="${project.github}" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> View Code</a>` : ''}
                        ${project.live ? `<a href="${project.live}" class="btn btn-primary" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                        ${project.caseStudy ? `<a href="${project.caseStudy}" class="btn btn-outline" target="_blank" rel="noopener noreferrer"><i class="fas fa-file-alt"></i> Case Study</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        
        // Disable body scroll when modal is open
        document.body.classList.add('modal-open');
    }
    
    /**
     * Get display name for category
     * @param {string} category - Category key
     * @returns {string} Display name for category
     */
    function getCategoryDisplayName(category) {
        const categories = {
            'iot': 'IoT System',
            'software': 'Web Application',
            'ml': 'ML/DL',
            'mobile': 'Mobile App',
            'design': 'UI/UX Design',
            'embedded': 'Embedded System'
        };
        
        return categories[category] || category;
    }
    
    /**
     * Load sample projects if no projects exist
     */
    function loadSampleProjects() {
        const sampleProjects = [
            {
                id: 'sample1',
                name: 'Smart Environment Monitoring',
                category: 'iot',
                description: 'An IoT-based system using ESP32 and multiple sensors to monitor environmental conditions with real-time data visualization.',
                image: 'img/projects/iot-monitoring.jpg',
                technologies: ['ESP32', 'MQTT', 'Node.js', 'InfluxDB'],
                github: 'https://github.com/username/smart-monitoring',
                live: 'https://smart-monitor-demo.com',
                caseStudy: 'https://smart-monitor-demo.com/case-study',
                featured: true,
                date: '2023-05-15',
                duration: '3 months',
                challenge: 'Creating a reliable sensor network that works in harsh environments with minimal power consumption.',
                solution: 'Implemented a custom low-power protocol with efficient data aggregation and edge processing.'
            },
            {
                id: 'sample2',
                name: 'Resource Management System',
                category: 'software',
                description: 'A full-stack application for resource allocation and management with user authentication and role-based access control.',
                image: 'img/projects/management-system.jpg',
                technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
                github: 'https://github.com/username/resource-management',
                live: 'https://resource-mgmt-demo.com',
                date: '2023-02-10',
                duration: '4 months'
            },
            {
                id: 'sample3',
                name: 'Health Monitoring ML Model',
                category: 'ml',
                description: 'Machine learning model that analyzes health data to predict potential health risks and recommend preventive measures.',
                image: 'img/projects/ml-health.jpg',
                technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas'],
                github: 'https://github.com/username/health-ml',
                caseStudy: 'https://health-ml-demo.com/case-study',
                date: '2022-11-20'
            }
        ];
        
        state.allProjects = sampleProjects;
        state.filteredProjects = [...sampleProjects];
        
        // Render the projects
        renderProjects();
    }
    
    /**
     * Observe images for lazy loading
     */
    function observeImages() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        // Create a new image to preload
                        const preloadImg = new Image();
                        preloadImg.onload = () => {
                            // Once preloaded, update the visible image
                            img.src = src;
                            img.classList.remove('lazy-image');
                            img.classList.add('loaded');
                        };
                        preloadImg.onerror = () => {
                            // If error, use default image
                            img.src = 'img/projects/default-project.jpg';
                            img.classList.remove('lazy-image');
                            img.classList.add('error');
                        };
                        preloadImg.src = src;
                        
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver support
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
            });
        }
    }
    
    /**
     * Initialize filter and sort listeners
     */
    function initializeFilterListeners() {
        // Category filter buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        if (categoryButtons.length > 0) {
            categoryButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active state
                    document.querySelector('.category-btn.active').classList.remove('active');
                    this.classList.add('active');
                    
                    // Update state and filter
                    state.currentCategory = this.getAttribute('data-filter');
                    filterProjects();
                });
            });
        }
        
        // Project search input
        const projectSearch = document.getElementById('project-search');
        if (projectSearch) {
            // Add debounce to search for better performance
            let searchTimeout;
            projectSearch.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    state.searchTerm = this.value;
                    filterProjects();
                }, 300);
            });
        }
        
        // Sort options (if available)
        const sortSelect = document.getElementById('project-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                state.sortOption = this.value;
                sortProjects();
                renderProjects();
            });
        }
    }
    
    // Call the function to load projects
    loadProjects();
});
