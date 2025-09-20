// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
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
const createMobileNav = () => {
    const nav = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-toggle')) {
            const toggle = document.createElement('div');
            toggle.className = 'mobile-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cursor = 'pointer';
            toggle.style.fontSize = '1.5rem';
            toggle.style.color = '#2c3e50';
            
            toggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-active');
            });
            
            navContainer.appendChild(toggle);
        }
    }
};

window.addEventListener('resize', createMobileNav);
window.addEventListener('load', createMobileNav);