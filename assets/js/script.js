// Enhanced smooth scrolling and navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile navigation toggle
    const createMobileNav = () => {
        const nav = document.querySelector('.nav-menu');
        const navContainer = document.querySelector('.nav-container');
        
        if (!document.querySelector('.mobile-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-toggle';
            toggle.innerHTML = '☰';
            toggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            toggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-active');
                toggle.innerHTML = nav.classList.contains('mobile-active') ? '✕' : '☰';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navContainer.contains(e.target)) {
                    nav.classList.remove('mobile-active');
                    toggle.innerHTML = '☰';
                }
            });
            
            navContainer.appendChild(toggle);
        }
    };

    // Enhanced animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToObserve = document.querySelectorAll('.project-card, .experience-item, .skill-category, .education-item');
    elementsToObserve.forEach((el, index) => {
        el.style.setProperty('--delay', `${index * 0.1}s`);
        observer.observe(el);
    });

    // Initialize mobile navigation
    createMobileNav();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.nav-menu')?.classList.remove('mobile-active');
            const toggle = document.querySelector('.mobile-toggle');
            if (toggle) toggle.innerHTML = '☰';
        }
    });

    // Add loading animation to existing elements
    const existingElements = document.querySelectorAll('.hero-content > *, .about > *, .experience > *, .skills > *, .education > *');
    existingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('loading');
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
});

// Add interactive hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('project-card') || 
        e.target.classList.contains('experience-item') || 
        e.target.classList.contains('skill-category')) {
        e.target.style.transform = 'translateY(-8px) scale(1.02)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('project-card') || 
        e.target.classList.contains('experience-item') || 
        e.target.classList.contains('skill-category')) {
        e.target.style.transform = 'translateY(0) scale(1)';
    }
});