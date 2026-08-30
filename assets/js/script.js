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
        window.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(90, Math.max(30, Math.floor(window.innerWidth / 18)));
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            this.ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.55)' : 'rgba(99, 102, 241, 0.45)';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.strokeStyle = isDark
                        ? `rgba(99, 102, 241, ${0.25 * (1 - distance / 120)})`
                        : `rgba(99, 102, 241, ${0.18 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });

            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                this.ctx.strokeStyle = isDark
                    ? `rgba(139, 92, 246, ${0.4 * (1 - distance / 150)})`
                    : `rgba(139, 92, 246, ${0.28 * (1 - distance / 150)})`;
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
            typeSpeed = 1800;
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
    const increment = target / (duration / 16);
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

// ==================== THEME TOGGLE ====================
const initThemeToggle = () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

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

// ==================== SCROLL ANIMATIONS ====================
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            if (entry.target.classList.contains('stat-number')) {
                const target = Number(entry.target.getAttribute('data-target') || 0);
                animateCounter(entry.target, target);
            }

            if (entry.target.classList.contains('skill-bar')) {
                const progressBar = entry.target.querySelector('.skill-level, .skill-progress-bar');
                const percentage = progressBar?.getAttribute('data-percentage') || progressBar?.style.width || '0';
                if (progressBar) {
                    progressBar.style.width = percentage.replace('%', '') + '%';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal, .stat-number, .skill-bar, .timeline-item').forEach((element) => {
        observer.observe(element);
    });
};

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== MOBILE NAVIGATION ====================
const initMobileNav = () => {
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    if (!navContainer || !navMenu) return;

    let toggle = document.querySelector('.mobile-toggle');

    if (window.innerWidth <= 768) {
        if (!toggle) {
            toggle = document.createElement('button');
            toggle.className = 'mobile-toggle';
            toggle.type = 'button';
            toggle.setAttribute('aria-label', 'Toggle navigation menu');
            toggle.innerHTML = '☰';

            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-active');
                toggle.classList.toggle('active');
                toggle.innerHTML = navMenu.classList.contains('mobile-active') ? '✕' : '☰';
            });

            navContainer.appendChild(toggle);
        }

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                const toggleButton = document.querySelector('.mobile-toggle');
                if (toggleButton) {
                    toggleButton.classList.remove('active');
                    toggleButton.innerHTML = '☰';
                }
            });
        });
    } else {
        if (toggle) {
            toggle.remove();
        }
        navMenu.classList.remove('mobile-active');
    }
};

// ==================== SKILL PROGRESS BARS ====================
const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach((bar) => {
        const progressBar = bar.querySelector('.skill-level, .skill-progress-bar');
        if (progressBar) {
            const width = progressBar.getAttribute('style')?.match(/width:\s*([^;]+)/)?.[1] || progressBar.style.width || '0%';
            progressBar.style.width = width;
        }
    });
};

// ==================== PROJECT CARDS INTERACTION ====================
const initProjectCards = () => {
    const cards = document.querySelectorAll('.project-card, .featured-card, .highlight-card, .experience-item, .skill-category');
    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
};

// ==================== INITIALIZE ON LOAD ====================
window.addEventListener('load', () => {
    new ParticleSystem();

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

    initThemeToggle();
    initMobileNav();
    initSkillBars();
    initProjectCards();
    observeElements();

    document.querySelectorAll('.experience-item, .project-card, .skill-category, .education-item').forEach((element) => {
        element.classList.add('scroll-reveal');
    });
});

// ==================== RESIZE HANDLER ====================
window.addEventListener('resize', () => {
    initMobileNav();
});

// ==================== PASSIVE EVENT LISTENERS ====================
document.addEventListener('touchstart', function () {}, { passive: true });
document.addEventListener('touchmove', function () {}, { passive: true });
