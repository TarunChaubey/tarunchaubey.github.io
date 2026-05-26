// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

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