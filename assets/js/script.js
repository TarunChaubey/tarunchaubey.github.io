(function () {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) root.dataset.theme = savedTheme;

    const themeButton = document.querySelector('[data-theme-toggle]');
    const setThemeLabel = () => {
        if (!themeButton) return;
        const dark = root.dataset.theme === 'dark';
        themeButton.textContent = dark ? '☀' : '☾';
        themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    setThemeLabel();
    themeButton?.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', root.dataset.theme);
        setThemeLabel();
    });

    const menuButton = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('.nav-menu');
    menuButton?.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(open));
    });
    menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.classList.remove('open')));

    const reveal = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        }), { threshold: .12 });
        reveal.forEach(item => observer.observe(item));
    } else reveal.forEach(item => item.classList.add('visible'));

    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        document.querySelectorAll('[data-category]').forEach(card => {
            card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
        });
    }));

    document.querySelectorAll('[data-arch-tab]').forEach(tab => tab.addEventListener('click', () => {
        const target = tab.dataset.archTab;
        document.querySelectorAll('[data-arch-tab]').forEach(item => item.setAttribute('aria-selected', String(item === tab)));
        document.querySelectorAll('[data-arch-panel]').forEach(panel => panel.hidden = panel.dataset.archPanel !== target);
    }));
}());
