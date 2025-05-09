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
        
        // Sort projects if needed
        // projects.sort((a, b) => a.order - b.order);
        
        // Add projects to the grid
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // If no projects are available, show sample projects
        if (projects.length === 0) {
            loadSampleProjects();
        }
    }
    
    // Create a project card element
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', '100');
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image || 'img/projects/default-project.jpg'}" alt="${project.name}">
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
                </div>
            </div>
        `;
        
        return card;
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
                name: 'Smart Environment Monitoring',
                category: 'iot',
                description: 'An IoT-based system using ESP32 and multiple sensors to monitor environmental conditions with real-time data visualization.',
                image: 'img/projects/iot-monitoring.jpg',
                technologies: ['ESP32', 'MQTT', 'Node.js'],
                github: 'https://github.com/username/smart-monitoring',
                live: 'https://smart-monitor-demo.com',
                caseStudy: 'https://smart-monitor-demo.com/case-study'
            },
            {
                name: 'Resource Management System',
                category: 'software',
                description: 'A full-stack application for resource allocation and management with user authentication and role-based access control.',
                image: 'img/projects/management-system.jpg',
                technologies: ['Java', 'Spring Boot', 'React'],
                github: 'https://github.com/username/resource-management',
                live: 'https://resource-mgmt-demo.com'
            },
            {
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
    
    // Call the function to load projects
    loadProjects();
});
