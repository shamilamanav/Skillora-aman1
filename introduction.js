// Force scroll restoration to manual control
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Always scroll to the top of the page on load
    window.scrollTo(0, 0);

    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');
    const splashLogo = document.querySelector('.splash-logo');
    const splashText = document.querySelector('.splash-text');
    
    const navigationEntries = performance.getEntriesByType("navigation");
    const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : '';

    const hasVisited = sessionStorage.getItem('hasVisitedIntro');

    // --- CASE 1: Returning (back/forward navigation) ---
    if (hasVisited && navigationType === 'back_forward') {
        // Skip splash completely
        splashScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible', 'fade-in'); // fade effect
        document.body.classList.add('is-returning');

        // Ensure scroll reveal is re-applied
        initScrollReveal();
        handlePageExit(); 

    } else {
        // --- CASE 2: First visit or page refresh ---
        sessionStorage.setItem('hasVisitedIntro', 'true');
        mainContent.classList.add('hidden');

        // Run splash animations
        setTimeout(() => { splashLogo.style.animation = 'fadeInScale 1s forwards'; }, 300);
        setTimeout(() => { splashText.style.animation = 'slideInLeft 1s forwards'; }, 800);

        // Fade out splash and show content
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            splashScreen.addEventListener('transitionend', () => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                mainContent.classList.add('visible');
                initScrollReveal();
                handlePageExit(); 
            }, { once: true });
        }, 3000);
    }

    // --- Scroll reveal setup ---
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Reset state if elements were already active before
        revealElements.forEach(el => {
            el.classList.remove('active');
            observer.observe(el);
        });
    }
    
    // --- Page exit transition ---
    function handlePageExit() {
        const navLinks = document.querySelectorAll('a.nav-card');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const destination = link.href;
                document.body.classList.add('is-exiting');
                setTimeout(() => {
                    window.location.href = destination;
                }, 500); 
            });
        });
    }
});



import { initScrollReveal, resetScrollReveal } from './scrollReveal.js';

// When loading theory.js after introduction.js
resetScrollReveal();   // clear previous animations
initScrollReveal();    // reinitialize observer for new elements
