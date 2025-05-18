/**
 * Admin Panel JavaScript
 * Handles project management operations and authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    // Authentication
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'  // Note: This is just for demo, use a more secure method in production
    };
    
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Project management elements
    const projectsList = document.querySelector('.project-list');
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    const modalTitle = document.getElementById('modal-title');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // Tech tags functionality
    const techInput = document.getElementById('tech-input');
    const addTechBtn = document.getElementById('add-tech-btn');
    const tagsList = document.querySelector('.tags-list');
    let currentTags = [];
    
    // Current project being edited/deleted
    let currentProjectId = null;
    
    // --- NEW: Skills Management ---
    const skillsList = document.querySelector('.skills-list');
    const addSkillBtn = document.getElementById('add-skill-btn');
    
    // --- NEW: Testimonials Management ---
    const testimonialsList = document.querySelector('.testimonials-list');
    const addTestimonialBtn = document.getElementById('add-testimonial-btn');
    
    // --- NEW: Settings Management ---
    const settingsForm = document.getElementById('settings-form');
    const defaultLight = document.getElementById('setting-default-light');
    
    // --- Export Projects JSON ---
    const exportProjectsBtn = document.getElementById('export-projects-btn');
    const lastUpdatedSpan = document.getElementById('last-updated');
    
    function updateLastUpdated() {
        const now = new Date();
        lastUpdatedSpan.textContent = now.toLocaleString();
        localStorage.setItem('portfolioLastUpdated', now.toISOString());
    }
    
    if (exportProjectsBtn) {
        exportProjectsBtn.addEventListener('click', function() {
            let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
            const file = new Blob([JSON.stringify(projects, null, 2)], {type: 'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = 'projects.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            updateLastUpdated();
            alert('Projects exported as projects.json!');
        });
    }
    
    // Check authentication
    if (!isLoggedIn) {
        loginModal.classList.add('active');
    } else {
        initAdminPanels();
    }
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            loginModal.classList.remove('active');
            loadProjects();
        } else {
            // FIXED: Use classList instead of inline style
            loginError.classList.add('active');
        }
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.reload();
    });
    
    // Load all projects from localStorage
    function loadProjects() {
        // Clear the loading indicator
        projectsList.innerHTML = '';
        
        // Get projects from localStorage or use empty array if none
        let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        
        // Sort projects to show featured ones first
        projects.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<div class="empty-message">No projects found. Add your first project!</div>';
            return;
        }
        
        // Render each project
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsList.appendChild(projectCard);
        });
    }
    
    // Create a project card element
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card-admin';
        if (project.featured) card.classList.add('featured');
        const categoryName = getCategoryDisplayName(project.category);
        card.innerHTML = `
            <div class="project-image-admin">
                <img src="${project.image || '../img/projects/default-project.jpg'}" alt="${project.name}">
                ${project.featured ? '<span class="featured-badge-admin">Featured</span>' : ''}
                <div class="project-actions">
                    <button class="edit-btn" data-id="${project.id}" title="Edit Project">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${project.id}" title="Delete Project">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="save-btn" data-id="${project.id}" title="Save Changes">
                        <i class="fas fa-save"></i>
                    </button>
                </div>
            </div>
            <div class="project-content-admin">
                <span class="project-category-admin">${categoryName}</span>
                <h3 contenteditable="true" class="editable-title">${project.name}</h3>
                <p contenteditable="true" class="editable-desc">${project.description}</p>
                <div class="project-tech-admin">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners for edit, delete, and save buttons
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const saveBtn = card.querySelector('.save-btn');
        
        editBtn.addEventListener('click', () => openEditProjectModal(project.id));
        deleteBtn.addEventListener('click', () => openDeleteConfirmation(project.id));
        saveBtn.addEventListener('click', function() {
            // Save contenteditable changes
            const title = card.querySelector('.editable-title').innerText.trim();
            const desc = card.querySelector('.editable-desc').innerText.trim();
            let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
            const idx = projects.findIndex(p => p.id === project.id);
            if (idx !== -1) {
                projects[idx].name = title;
                projects[idx].description = desc;
                localStorage.setItem('portfolioProjects', JSON.stringify(projects));
                updateLastUpdated();
                alert('Project updated!');
            }
        });
        
        return card;
    }
    
    // Get display name for category
    function getCategoryDisplayName(category) {
        const categories = {
            'iot': 'IoT',
            'software': 'Software',
            'ml': 'ML/DL'
        };
        
        return categories[category] || category;
    }
    
    // Open the add project modal
    addProjectBtn.addEventListener('click', function() {
        // Reset the form
        projectForm.reset();
        currentProjectId = null;
        modalTitle.textContent = 'Add New Project';
        
        // Reset featured checkbox
        document.getElementById('project-featured').checked = false;
        
        // Clear tech tags
        currentTags = [];
        renderTags();
        
        // Show the modal
        projectModal.classList.add('active');
    });
    
    // Close modals when clicking on close button or cancel
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Save project (create/update)
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('project-name').value;
        const category = document.getElementById('project-category').value;
        const description = document.getElementById('project-description').value;
        const image = document.getElementById('project-image').value;
        const githubUrl = document.getElementById('project-github').value;
        const liveUrl = document.getElementById('project-live').value;
        const caseStudyUrl = document.getElementById('project-case-study').value;
        const featured = document.getElementById('project-featured').checked;
        
        // Get projects from localStorage
        let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        
        if (currentProjectId) {
            // Update existing project
            const index = projects.findIndex(project => project.id === currentProjectId);
            
            if (index !== -1) {
                projects[index] = {
                    ...projects[index],
                    name,
                    category,
                    description,
                    image,
                    technologies: currentTags,
                    github: githubUrl,
                    live: liveUrl,
                    caseStudy: caseStudyUrl,
                    featured: featured
                };
            }
        } else {
            // Add new project
            const newProject = {
                id: generateId(),
                name,
                category,
                description,
                image,
                technologies: currentTags,
                github: githubUrl,
                live: liveUrl,
                caseStudy: caseStudyUrl,
                featured: featured
            };
            
            projects.push(newProject);
        }
        
        // Save to localStorage
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        
        // Close modal and reload projects
        projectModal.classList.remove('active');
        loadProjects();
        updateLastUpdated();
    });
    
    // Open edit project modal
    function openEditProjectModal(projectId) {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        const project = projects.find(p => p.id === projectId);
        
        if (!project) return;
        
        // Set form values
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-category').value = project.category;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-image').value = project.image || '';
        document.getElementById('project-github').value = project.github || '';
        document.getElementById('project-live').value = project.live || '';
        document.getElementById('project-case-study').value = project.caseStudy || '';
        document.getElementById('project-featured').checked = project.featured || false;
        
        // Set current project ID
        currentProjectId = projectId;
        
        // Set tech tags
        currentTags = [...(project.technologies || [])];
        renderTags();
        
        // Update modal title
        modalTitle.textContent = 'Edit Project';
        
        // Show the modal
        projectModal.classList.add('active');
    }
    
    // Open delete confirmation modal
    function openDeleteConfirmation(projectId) {
        currentProjectId = projectId;
        confirmModal.classList.add('active');
    }
    
    // Delete project
    confirmDeleteBtn.addEventListener('click', function() {
        if (!currentProjectId) return;
        
        // Get projects from localStorage
        let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        
        // Filter out the project to delete
        projects = projects.filter(project => project.id !== currentProjectId);
        
        // Save updated projects to localStorage
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        
        // Close modal and reload projects
        confirmModal.classList.remove('active');
        loadProjects();
        updateLastUpdated();
    });
    
    // Add tech tag
    addTechBtn.addEventListener('click', function() {
        const tech = techInput.value.trim();
        
        if (tech && !currentTags.includes(tech)) {
            currentTags.push(tech);
            techInput.value = '';
            renderTags();
        }
    });
    
    // Handle Enter key in tech input
    techInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechBtn.click();
        }
    });
    
    // Render tech tags
    function renderTags() {
        tagsList.innerHTML = '';
        
        currentTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" data-tag="${tag}">&times;</span>
            `;
            
            tagsList.appendChild(tagElement);
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-tag').forEach(button => {
            button.addEventListener('click', function() {
                const tag = this.getAttribute('data-tag');
                currentTags = currentTags.filter(t => t !== tag);
                renderTags();
            });
        });
    }
    
    // Generate a unique ID for projects
    function generateId() {
        return 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Sidebar menu navigation
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active menu item
            document.querySelectorAll('.admin-menu li').forEach(item => {
                item.classList.remove('active');
            });
            
            this.parentNode.classList.add('active');
            
            // Show the corresponding panel
            const panelId = this.getAttribute('href').substring(1);
            document.querySelectorAll('.admin-panel-section').forEach(panel => {
                panel.classList.remove('active');
            });
            
            document.getElementById(panelId + '-panel').classList.add('active');
        });
    });
    
    // Initialize with sample projects if none exist
    function initializeSampleProjects() {
        const existingProjects = localStorage.getItem('portfolioProjects');
        
        if (!existingProjects) {
            const sampleProjects = [
                {
                    id: 'project_1',
                    name: 'Smart Environment Monitoring',
                    category: 'iot',
                    description: 'An IoT-based system using ESP32 and multiple sensors to monitor environmental conditions with real-time data visualization.',
                    image: '../img/projects/iot-monitoring.jpg',
                    technologies: ['ESP32', 'MQTT', 'Node.js'],
                    github: 'https://github.com/username/smart-monitoring',
                    live: 'https://smart-monitor-demo.com',
                    caseStudy: 'https://smart-monitor-demo.com/case-study',
                    featured: true
                },
                {
                    id: 'project_2',
                    name: 'Resource Management System',
                    category: 'software',
                    description: 'A full-stack application for resource allocation and management with user authentication and role-based access control.',
                    image: '../img/projects/management-system.jpg',
                    technologies: ['Java', 'Spring Boot', 'React'],
                    github: 'https://github.com/username/resource-management',
                    live: 'https://resource-mgmt-demo.com'
                },
                {
                    id: 'project_3',
                    name: 'Predictive Analytics Model',
                    category: 'ml',
                    description: 'A machine learning model that predicts future trends based on historical data.',
                    image: '../img/projects/prediction-model.jpg',
                    technologies: ['Python', 'TensorFlow', 'Pandas'],
                    github: 'https://github.com/username/predictive-analytics',
                    live: 'https://predictive-analytics-demo.com',
                    caseStudy: 'https://predictive-analytics-demo.com/case-study',
                    featured: true
                },
                {
                    id: 'project_4',
                    name: 'Home Automation System',
                    category: 'iot',
                    description: 'A smart home automation system that allows users to control home devices remotely.',
                    image: '../img/projects/home-automation.jpg',
                    technologies: ['Raspberry Pi', 'MQTT', 'Node-RED'],
                    github: 'https://github.com/username/home-automation',
                    live: 'https://home-automation-demo.com'
                },
                {
                    id: 'project_5',
                    name: 'RESTful API Service',
                    category: 'software',
                    description: 'A RESTful API service for managing user data and authentication.',
                    image: '../img/projects/api-service.jpg',
                    technologies: ['Node.js', 'Express', 'MongoDB'],
                    github: 'https://github.com/username/restful-api',
                    live: 'https://restful-api-demo.com'
                },
                {
                    id: 'project_6',
                    name: 'Image Recognition System',
                    category: 'ml',
                    description: 'An image recognition system that classifies images using deep learning models.',
                    image: '../img/projects/image-recognition.jpg',
                    technologies: ['Python', 'Keras', 'OpenCV'],
                    github: 'https://github.com/username/image-recognition',
                    live: 'https://image-recognition-demo.com',
                    caseStudy: 'https://image-recognition-demo.com/case-study',
                    featured: true
                }
            ];
            
            localStorage.setItem('portfolioProjects', JSON.stringify(sampleProjects));
        }
    }
    
    // Load skills from localStorage
    function loadSkills() {
        const skills = JSON.parse(localStorage.getItem('portfolioSkills')) || [];
        skillsList.innerHTML = '';
        if (!skills.length) {
            skillsList.innerHTML = '<div class="empty-message">No skills found.</div>';
            return;
        }
        skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'project-card-admin';
            card.innerHTML = `
                <div class="project-content-admin">
                    <h3>${skill.name}</h3>
                    <p>Proficiency: ${skill.level}%</p>
                    <div class="project-actions">
                        <button class="edit-skill-btn" data-id="${skill.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-skill-btn" data-id="${skill.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
            skillsList.appendChild(card);
        });
    }
    
    // Load testimonials from localStorage
    function loadTestimonials() {
        const list = JSON.parse(localStorage.getItem('portfolioTestimonials')) || [];
        testimonialsList.innerHTML = '';
        if (!list.length) {
            testimonialsList.innerHTML = '<div class="empty-message">No testimonials found.</div>';
            return;
        }
        list.forEach(item => {
            const card = document.createElement('div');
            card.className = 'project-card-admin';
            card.innerHTML = `
                <div class="project-content-admin">
                    <h3>${item.author}</h3>
                    <p>"${item.text}"</p>
                    <div class="project-actions">
                        <button class="edit-test-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-test-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
            testimonialsList.appendChild(card);
        });
    }
    
    // initialize toggle
    defaultLight.checked = localStorage.getItem('theme')==='light';
    
    // Save settings
    settingsForm.addEventListener('submit', e=>{
        e.preventDefault();
        localStorage.setItem('theme', defaultLight.checked?'light':'dark');
        alert('Settings saved.');
    });
    
    // initialize all
    function initAdminPanels() {
        loadProjects();
        loadSkills();
        loadTestimonials();
    }
    
    // Initialize sample data
    initializeSampleProjects();
    
    // On page load, show last updated if available
    const last = localStorage.getItem('portfolioLastUpdated');
    if (last && lastUpdatedSpan) {
        lastUpdatedSpan.textContent = new Date(last).toLocaleString();
    }
});
