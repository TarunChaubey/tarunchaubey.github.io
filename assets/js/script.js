// ==================== PARTICLE SYSTEM ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Draw particle
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(99, 102, 241, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect nearby particles
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.strokeStyle = isDark 
                        ? `rgba(99, 102, 241, ${0.3 * (1 - distance / 120)})`
                        : `rgba(99, 102, 241, ${0.2 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });

            // Connect to mouse
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                this.ctx.strokeStyle = isDark
                    ? `rgba(139, 92, 246, ${0.4 * (1 - distance / 150)})`
                    : `rgba(139, 92, 246, ${0.3 * (1 - distance / 150)})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouseX, this.mouseY);
                this.ctx.stroke();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== TYPING ANIMATION ====================
class TypingAnimation {
    constructor(element, phrases, speed = 100) {
        this.element = element;
        this.phrases = phrases;
        this.speed = speed;
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentPhrase = this.phrases[this.phraseIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ==================== SCROLL ANIMATIONS ====================
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                }
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-bar')) {
                    const progressBar = entry.target.querySelector('.skill-progress-bar');
                    const percentage = progressBar.getAttribute('data-percentage');
                    setTimeout(() => {
                        progressBar.style.width = percentage + '%';
                    }, 100);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal, .stat-number, .skill-bar, .timeline-item').forEach(el => {
        observer.observe(el);
    });
};

// ==================== THEME TOGGLE ====================
const initThemeToggle = () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    toggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
};

function updateThemeIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
<<<<<<< HEAD
        const href = this.getAttribute('href');
        if (document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
=======
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
>>>>>>> b886b58 (update repo files)
            });
        }
    });
});

<<<<<<< HEAD
// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
=======
// ==================== NAVBAR SCROLL EFFECT ====================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
>>>>>>> b886b58 (update repo files)
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
<<<<<<< HEAD
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
=======
    
    lastScroll = currentScroll;
});

// ==================== MOBILE NAVIGATION ====================
const initMobileNav = () => {
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-toggle';
        toggle.innerHTML = '☰';
        toggle.setAttribute('aria-label', 'Toggle navigation');
        
        toggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            toggle.innerHTML = navMenu.classList.contains('mobile-active') ? '✕' : '☰';
        });
        
        navContainer.appendChild(toggle);
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                toggle.innerHTML = '☰';
            });
        });
    }
};

// ==================== SKILL PROGRESS BARS ====================
const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const progressBar = bar.querySelector('.skill-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    });
};

// ==================== ACTIVE NAV HIGHLIGHTING ====================
const updateActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
>>>>>>> b886b58 (update repo files)
};

window.addEventListener('scroll', updateActiveNav);

<<<<<<< HEAD
// Observe all project cards and experience items
document.querySelectorAll('.project-card, .experience-item, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Mobile navigation toggle
const setupMobileNav = () => {
    const nav = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-toggle';
            toggle.setAttribute('aria-label', 'Toggle navigation menu');
            toggle.innerHTML = '<span>☰</span>';
            
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                nav.classList.toggle('mobile-active');
                toggle.classList.toggle('active');
            });
            
            // Close menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('mobile-active');
                    toggle.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navContainer.contains(e.target)) {
                    nav.classList.remove('mobile-active');
                    toggle.classList.remove('active');
                }
            });
            
            navContainer.appendChild(toggle);
        }
    } else {
        // Remove mobile toggle on desktop
        const toggle = document.querySelector('.mobile-toggle');
        if (toggle) toggle.remove();
        nav.classList.remove('mobile-active');
    }
};

window.addEventListener('resize', setupMobileNav);
window.addEventListener('load', setupMobileNav);
=======
// ==================== PROJECT CARDS INTERACTION ====================
const initProjectCards = () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
};

// ==================== INITIALIZE ON LOAD ====================
window.addEventListener('load', () => {
    // Initialize particle system
    new ParticleSystem();
    
    // Initialize typing animation if element exists
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const phrases = [
            'Specializing in Computer Vision, NLP, and Generative AI Solutions',
            'Building Scalable AI Systems on AWS & Azure',
            'Expert in RAG Systems & LLM Integration',
            'Deploying Production-Ready ML Models'
        ];
        new TypingAnimation(typingElement, phrases);
    }
    
    // Initialize other features
    initThemeToggle();
    initMobileNav();
    initSkillBars();
    initProjectCards();
    observeElements();
    
    // Add scroll-reveal class to elements
    document.querySelectorAll('.experience-item, .project-card, .skill-category, .education-item').forEach(el => {
        el.classList.add('scroll-reveal');
    });
});

// ==================== RESIZE HANDLER ====================
window.addEventListener('resize', () => {
    initMobileNav();
});

// ==================== PASSIVE EVENT LISTENERS ====================
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchmove', function() {}, { passive: true });
>>>>>>> b886b58 (update repo files)
