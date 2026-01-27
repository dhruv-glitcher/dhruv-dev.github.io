// ===================================
// CUSTOM CURSOR
// ===================================

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.cursorPos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.isHovering = false;
        this.isClicking = false;
        
        this.init();
    }
    
    init() {
        // Check if device supports hover (not touch device)
        if (window.matchMedia('(hover: none)').matches) {
            return;
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursorPos.x = e.clientX;
            this.cursorPos.y = e.clientY;
        });
        
        // Handle mouse down/up for click feedback
        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            this.cursor.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.cursor.classList.remove('cursor-click');
        });
        
        // Add hover listeners to interactive elements
        this.addHoverListeners();
        
        // Start animation loop
        this.animate();
    }
    
    addHoverListeners() {
        const interactiveElements = document.querySelectorAll('a, button, .magnetic-element');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.cursor.classList.add('cursor-hover');
                this.cursorFollower.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.cursor.classList.remove('cursor-hover');
                this.cursorFollower.classList.remove('cursor-hover');
            });
        });
    }
    
    animate() {
        // Easing for smooth cursor movement
        const ease = 0.15;
        
        // Update cursor position (instant)
        this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
        
        // Update follower position (with easing)
        this.followerPos.x += (this.cursorPos.x - this.followerPos.x) * ease;
        this.followerPos.y += (this.cursorPos.y - this.followerPos.y) * ease;
        
        this.cursorFollower.style.transform = `translate(${this.followerPos.x}px, ${this.followerPos.y}px)`;
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// MAGNETIC HOVER EFFECT
// ===================================

class MagneticEffect {
    constructor() {
        this.magneticElements = document.querySelectorAll('.magnetic-element');
        this.init();
    }
    
    init() {
        // Only enable on devices with hover support
        if (window.matchMedia('(hover: none)').matches) {
            return;
        }
        
        this.magneticElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.onMouseEnter(e.currentTarget);
            });
            
            element.addEventListener('mousemove', (e) => {
                this.onMouseMove(e);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.onMouseLeave(e.currentTarget);
            });
        });
    }
    
    onMouseEnter(element) {
        element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    onMouseMove(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        
        // Calculate mouse position relative to element center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Magnetic strength (adjust for more/less pull)
        const strength = 0.3;
        
        // Apply magnetic translation
        element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }
    
    onMouseLeave(element) {
        element.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        element.style.transform = 'translate(0, 0)';
    }
}

// ===================================
// SMOOTH SCROLL
// ===================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        const animateElements = document.querySelectorAll('.section, .project-card, .skill-category, .stat-card, .contact-card');
        
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });
        
        // Add animation class styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================================
// NAVIGATION BACKGROUND ON SCROLL
// ===================================

class NavigationScroll {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.scrollThreshold = 50;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > this.scrollThreshold) {
                this.nav.style.background = 'rgba(10, 10, 10, 0.95)';
                this.nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            } else {
                this.nav.style.background = 'rgba(10, 10, 10, 0.8)';
                this.nav.style.boxShadow = 'none';
            }
        });
    }
}

// ===================================
// PARALLAX EFFECT FOR HERO CARDS
// ===================================

class ParallaxEffect {
    constructor() {
        this.floatingCards = document.querySelectorAll('.floating-card');
        this.init();
    }
    
    init() {
        // Only enable on desktop
        if (window.matchMedia('(max-width: 1024px)').matches) {
            return;
        }
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.floatingCards.forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                card.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// ===================================
// PROJECT CARD TILT EFFECT
// ===================================

class ProjectTilt {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        // Only enable on devices with hover support
        if (window.matchMedia('(hover: none)').matches) {
            return;
        }
        
        this.projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.handleTilt(e, card);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.resetTilt(card);
            });
        });
    }
    
    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 degrees
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ===================================
// SKILL ITEMS STAGGER ANIMATION
// ===================================

class SkillsAnimation {
    constructor() {
        this.skillCategories = document.querySelectorAll('.skill-category');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 50); // Stagger delay
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        // Set initial styles and observe
        this.skillCategories.forEach(category => {
            const skillItems = category.querySelectorAll('.skill-item');
            
            skillItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            });
            
            observer.observe(category);
        });
    }
}

// ===================================
// STATS COUNTER ANIMATION
// ===================================

class StatsCounter {
    constructor() {
        this.statCards = document.querySelectorAll('.stat-card');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        if (this.statCards.length > 0) {
            observer.observe(this.statCards[0].parentElement);
        }
    }
    
    animateStats() {
        this.statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }
}

// ===================================
// BUTTON CLICK RIPPLE EFFECT
// ===================================

class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createRipple(e, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Add ripple animation to styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===================================
// MOBILE MENU (Simple responsive)
// ===================================

class MobileMenu {
    constructor() {
        this.init();
    }
    
    init() {
        // Simple responsive handling - on mobile, clicking nav links scrolls smoothly
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Smooth scroll is already handled by SmoothScroll class
                // This is just for potential mobile menu closing in future
            });
        });
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Reduce animations on low-power devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduce-motion');
            
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.style.scrollBehavior = 'auto';
        }
    }
}

// ===================================
// INITIALIZE ALL MODULES
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    new CustomCursor();
    new MagneticEffect();
    new SmoothScroll();
    new ScrollAnimations();
    new NavigationScroll();
    new ParallaxEffect();
    new ProjectTilt();
    new SkillsAnimation();
    new StatsCounter();
    new RippleEffect();
    new MobileMenu();
    new PerformanceOptimizer();
    
    // Log initialization
    console.log('🚀 Portfolio initialized successfully!');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

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
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}