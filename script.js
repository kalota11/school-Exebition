/**
 * PAKISTAN HISTORY EDUCATIONAL WEBSITE
 * Vanilla JavaScript - Interactive Animations & Effects
 * =====================================================
 */

// =====================================================
// DOM ELEMENTS
// =====================================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const particlesContainer = document.getElementById('particles');
const finalFlag = document.getElementById('finalFlag');
const celebrationParticles = document.getElementById('celebrationParticles');
const finalParticles = document.getElementById('finalParticles');

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initParticles();
    initParallax();
    initScrollAnimations();
    initFlagAnimation();
    initCelebrationParticles();
    initFinalParticles();
    initSmoothScroll();
    initMouseEffects();
});

// =====================================================
// NAVIGATION FUNCTIONALITY
// =====================================================

function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =====================================================
// PARTICLE SYSTEM
// =====================================================

function initParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 8 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 15 + 's';
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.4 + 0.2;
    
    // Random color variation
    const colors = ['#006a4e', '#008a65', '#d4af37', '#f4d03f'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    
    particlesContainer.appendChild(particle);
}

// =====================================================
// PARALLAX EFFECTS
// =====================================================

function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.1;
            const offset = scrollY * speed;
            layer.style.transform = `translateY(${offset}px)`;
        });
    });

    // Mouse move parallax for hero
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        hero.addEventListener('mousemove', (e) => {
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;
            
            const layers = heroBackground.querySelectorAll('.parallax-layer');
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.05;
                layer.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
}

// =====================================================
// SCROLL ANIMATIONS (AOS Implementation)
// =====================================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, parseInt(delay));
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => observer.observe(element));
    
    // Also trigger animations on page load for visible elements
    setTimeout(() => {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('aos-animate');
            }
        });
    }, 100);
}

// =====================================================
// FLAG ANIMATION
// =====================================================

function initFlagAnimation() {
    if (!finalFlag) return;
    
    // Animate flag on scroll into view
    const flagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                finalFlag.classList.add('flag-visible');
                animateFlagWave();
            }
        });
    }, { threshold: 0.5 });
    
    flagObserver.observe(finalFlag);
}

function animateFlagWave() {
    const flagCloth = finalFlag.querySelector('.flag-cloth');
    if (!flagCloth) return;
    
    // Enhanced wave animation
    let angle = 0;
    let direction = 1;
    
    const waveInterval = setInterval(() => {
        angle += direction * 0.5;
        
        if (angle > 10) direction = -1;
        if (angle < -5) direction = 1;
        
        flagCloth.style.transform = `rotate(${angle}deg)`;
    }, 100);
    
    // Stop after some time or when element is out of view
    setTimeout(() => {
        clearInterval(waveInterval);
    }, 10000);
}

// =====================================================
// CELEBRATION PARTICLES
// =====================================================

function initCelebrationParticles() {
    if (!celebrationParticles) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createCelebrationParticles();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(celebrationParticles);
}

function createCelebrationParticles() {
    if (!celebrationParticles) return;
    
    const colors = ['#006a4e', '#008a65', '#d4af37', '#f4d03f', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                bottom: 0;
                animation: celebrate-particle ${Math.random() * 3 + 2}s ease-out forwards;
            `;
            
            celebrationParticles.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 5000);
        }, i * 50);
    }
    
    // Add keyframes for celebration particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrate-particle {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-200px) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// =====================================================
// FINAL PARTICLES (for celebration section)
// =====================================================

function initFinalParticles() {
    if (!finalParticles) return;
    
    // Create floating particles for final section
    const colors = ['#006a4e', '#008a65', '#d4af37', '#f4d03f'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createFinalParticle(colors);
        }, i * 100);
    }
    
    // Continuously create new particles
    setInterval(() => {
        createFinalParticle(colors);
    }, 500);
}

function createFinalParticle(colors) {
    if (!finalParticles) return;
    
    const particle = document.createElement('div');
    const size = Math.random() * 15 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float-final ${Math.random() * 10 + 10}s infinite ease-in-out;
        opacity: ${Math.random() * 0.5 + 0.2};
    `;
    
    finalParticles.appendChild(particle);
    
    // Remove particle after some time to prevent DOM overload
    setTimeout(() => {
        particle.remove();
    }, 20000);
}

// Add final particles animation
const finalStyle = document.createElement('style');
finalStyle.textContent = `
    @keyframes float-final {
        0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translateY(-50px) translateX(20px) scale(1.2);
            opacity: 0.6;
        }
        50% {
            transform: translateY(-30px) translateX(-20px) scale(1);
            opacity: 0.4;
        }
        75% {
            transform: translateY(-70px) translateX(10px) scale(1.1);
            opacity: 0.7;
        }
    }
`;
document.head.appendChild(finalStyle);

// =====================================================
// SMOOTH SCROLL
// =====================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// MOUSE EFFECTS
// =====================================================

function initMouseEffects() {
    // Glowing cursor effect for buttons and cards
    const interactiveElements = document.querySelectorAll('.btn, .card, .event-card, .timeline-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transition = 'all 0.3s ease';
        });
    });
    
    // Mouse move effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 50;
            const moveY = (y - centerY) / 50;
            
            const heroText = document.querySelector('.hero-text-container');
            const heroVisual = document.querySelector('.hero-visual');
            
            if (heroText) {
                heroText.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
            if (heroVisual) {
                heroVisual.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
            }
        });
        
        hero.addEventListener('mouseleave', () => {
            const heroText = document.querySelector('.hero-text-container');
            const heroVisual = document.querySelector('.hero-visual');
            
            if (heroText) {
                heroText.style.transform = 'translate(0, 0)';
            }
            if (heroVisual) {
                heroVisual.style.transform = 'translate(0, 0)';
            }
        });
    }
    
    // Card hover tilt effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// =====================================================
// TIMELINE ANIMATION ENHANCEMENT
// =====================================================

function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('timeline-visible');
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(item);
    });
}

// Call it after DOM is ready
document.addEventListener('DOMContentLoaded', initTimelineAnimation);

// =====================================================
// JOURNEY PATH ANIMATION
// =====================================================

function initJourneyAnimation() {
    const journeySteps = document.querySelectorAll('.journey-step');
    
    journeySteps.forEach((step, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    step.style.animationDelay = `${index * 0.1}s`;
                    step.classList.add('journey-visible');
                    
                    // Animate connector
                    if (index > 0) {
                        const connector = document.querySelector(`.journey-connector:nth-of-type(${index})`);
                        if (connector) {
                            connector.classList.add('connector-visible');
                        }
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(step);
    });
}

// Call it after DOM is ready
document.addEventListener('DOMContentLoaded', initJourneyAnimation);

// Add journey connector animation
const journeyStyle = document.createElement('style');
journeyStyle.textContent = `
    .journey-connector {
        height: 0;
        transition: height 0.5s ease, opacity 0.5s ease;
        opacity: 0;
    }
    
    .journey-step.journey-visible + .journey-connector {
        height: 40px;
        opacity: 1;
    }
    
    @keyframes journey-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(journeyStyle);

// =====================================================
// SUMMARY ANIMATION
// =====================================================

function initSummaryAnimation() {
    const summaryVisual = document.querySelector('.summary-visual');
    const summaryFlag = document.querySelector('.summary-flag');
    
    if (summaryFlag) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    summaryFlag.classList.add('summary-flag-visible');
                    
                    // Animate rings
                    const rings = summaryFlag.querySelectorAll('.flag-ring');
                    rings.forEach((ring, index) => {
                        ring.style.animationDelay = `${index * 0.2}s`;
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(summaryFlag);
    }
}

// Call it after DOM is ready
document.addEventListener('DOMContentLoaded', initSummaryAnimation);

// =====================================================
// CELEBRATION FLAG ANIMATION
// =====================================================

function initCelebrationFlag() {
    const celebrationFlag = document.getElementById('celebrationFlag');
    
    if (celebrationFlag) {
        const flagCloth = celebrationFlag.querySelector('.flag-cloth');
        
        // Continuous wave animation
        let angle = 0;
        let direction = 1;
        
        setInterval(() => {
            angle += direction * 1;
            
            if (angle > 15) direction = -1;
            if (angle < -10) direction = 1;
            
            if (flagCloth) {
                flagCloth.style.transform = `rotate(${angle}deg)`;
            }
        }, 150);
    }
}

// Call it after DOM is ready
document.addEventListener('DOMContentLoaded', initCelebrationFlag);

// =====================================================
// TYPEWRITER EFFECT FOR HERO TITLE
// =====================================================

function initTypewriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const titleLines = heroTitle.querySelectorAll('.title-line');
    
    // Already animated with CSS, but we can enhance it
    titleLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.2}s`;
    });
}

// Call it after DOM is ready
document.addEventListener('DOMContentLoaded', initTypewriter);

// =====================================================
// COUNTER ANIMATION FOR YEARS
// =====================================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.marker-year');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const year = entry.target.textContent;
                const number = parseInt(year);
                if (!isNaN(number)) {
                    animateCounter(entry.target, number, 1500);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Call it after DOM is ready
document.addEventListener('DOMContentLoaded', initCounterAnimation);

// =====================================================
// PRELOADER (Optional)
// =====================================================

function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Call it after DOM is ready
setTimeout(hidePreloader, 1000);

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =====================================================
// CONSOLE MESSAGE
// =====================================================

console.log('%c پاکستان زندہ باد ', 'background: #006a4e; color: #ffffff; font-size: 24px; padding: 10px;');
console.log('%c 14 اگست 1947ء — ایک خواب حقیقت بن گیا ', 'background: #d4af37; color: #000; font-size: 16px; padding: 5px;');
