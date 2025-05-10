/**
 * Projects Loader
 * Dynamically loads projects from localStorage data
 */

document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return;
    
    // Load projects from localStorage
    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        
        // Clear existing projects if any
        projectsGrid.innerHTML = '';
        
        // Sort projects to show featured ones first
        projects.sort((a, b) => {
            // Featured projects come first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            
            // Then sort by most recent (assuming projects have a date field)
            // If not available, maintain existing order
            return 0;
        });
        
        // Add projects to the grid
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // Add a "no results" message that will be shown when filters return nothing
        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.textContent = 'No projects match your search criteria';
        noResults.style.display = 'none';
        projectsGrid.appendChild(noResults);
        
        // If no projects are available, show sample projects
        if (projects.length === 0) {
            loadSampleProjects();
        }
    }
    
    // Create a project card element
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (project.featured) card.classList.add('featured-project');
        
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', '100');
        
        card.innerHTML = `
            <div class="project-image">
                <img data-src="${project.image || 'img/projects/default-project.jpg'}" 
                     src="img/placeholder.jpg" 
                     alt="${project.name}"
                     class="lazy-image">
                ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                <div class="project-overlay">
                    ${project.live ? `<a href="${project.live}" class="project-link" target="_blank"><i class="fas fa-link"></i></a>` : ''}
                    ${project.github ? `<a href="${project.github}" class="project-github" target="_blank"><i class="fab fa-github"></i></a>` : ''}
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
                    ${project.github ? `<a href="${project.github}" class="btn btn-sm" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.caseStudy ? `<a href="${project.caseStudy}" class="btn btn-sm case-study-btn" target="_blank"><i class="fas fa-file-alt"></i> Case Study</a>` : ''}
                    <button class="btn btn-sm details-btn" data-id="${project.id || ''}"><i class="fas fa-info-circle"></i> Details</button>
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
    
    // Show project details in a modal
    function showProjectDetails(project) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('project-details-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'project-details-modal';
            modal.className = 'modal project-modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-project-title"></h3>
                        <button class="modal-close">&times;</button>
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
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
        
        // Populate modal with project details
        const title = modal.querySelector('#modal-project-title');
        const content = modal.querySelector('#modal-project-content');
        
        title.textContent = project.name;
        
        content.innerHTML = `
            <div class="project-details">
                <div class="project-details-image">
                    <img src="${project.image || 'img/projects/default-project.jpg'}" alt="${project.name}">
                </div>
                <div class="project-details-content">
                    <div class="project-details-category">
                        <span class="category-badge">${getCategoryDisplayName(project.category)}</span>
                        ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    </div>
                    <div class="project-details-description">
                        <h4>About This Project</h4>
                        <p>${project.description}</p>
                    </div>
                    <div class="project-details-technologies">
                        <h4>Technologies</h4>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="project-details-links">
                        ${project.github ? `<a href="${project.github}" class="btn btn-primary" target="_blank"><i class="fab fa-github"></i> View Code</a>` : ''}
                        ${project.live ? `<a href="${project.live}" class="btn btn-primary" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                        ${project.caseStudy ? `<a href="${project.caseStudy}" class="btn btn-outline" target="_blank"><i class="fas fa-file-alt"></i> Case Study</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
    }
    
    // Get display name for category
    function getCategoryDisplayName(category) {
        const categories = {
            'iot': 'IoT System',
            'software': 'Web Application',
            'ml': 'ML/DL'
        };
        
        return categories[category] || category;
    }
    
    // Load sample projects if no projects exist
    function loadSampleProjects() {
        const sampleProjects = [
            {
                id: 'sample1',
                name: 'Smart Environment Monitoring',
                category: 'iot',
                description: 'An IoT-based system using ESP32 and multiple sensors to monitor environmental conditions with real-time data visualization.',
                image: 'img/projects/iot-monitoring.jpg',
                technologies: ['ESP32', 'MQTT', 'Node.js'],
                github: 'https://github.com/username/smart-monitoring',
                live: 'https://smart-monitor-demo.com',
                caseStudy: 'https://smart-monitor-demo.com/case-study',
                featured: true
            },
            {
                id: 'sample2',
                name: 'Resource Management System',
                category: 'software',
                description: 'A full-stack application for resource allocation and management with user authentication and role-based access control.',
                image: 'img/projects/management-system.jpg',
                technologies: ['Java', 'Spring Boot', 'React'],
                github: 'https://github.com/username/resource-management',
                live: 'https://resource-mgmt-demo.com'
            },
            {
                id: 'sample3',
                name: 'Health Monitoring ML Model',
                category: 'ml',
                description: 'Machine learning model that analyzes health data to predict potential health risks and recommend preventive measures.',
                image: 'img/projects/ml-health.jpg',
                technologies: ['Python', 'TensorFlow', 'Scikit-learn'],
                github: 'https://github.com/username/health-ml',
                caseStudy: 'https://health-ml-demo.com/case-study'
            }
        ];
        
        sampleProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    // Observe images for lazy loading
    function observeImages() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-image');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
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
    
    // Call the function to load projects
    loadProjects();
    
    // Initialize lazy loading
    setTimeout(observeImages, 100);
});
