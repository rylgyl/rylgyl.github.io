// ==========================================
// PARTICLE SYSTEM
// ==========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouseX = 0;
        this.mouseY = 0;
        this.connectionDistance = 150;

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        // Get theme colors
        const isDark = !document.body.hasAttribute('data-theme') ||
                       document.body.getAttribute('data-theme') === 'dark';
        this.ctx.fillStyle = isDark ? 'rgba(0, 245, 255, 0.5)' : 'rgba(0, 136, 204, 0.5)';
        this.ctx.fill();
    }

    connectParticles() {
        const isDark = !document.body.hasAttribute('data-theme') ||
                       document.body.getAttribute('data-theme') === 'dark';

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.strokeStyle = isDark
                        ? `rgba(0, 245, 255, ${opacity})`
                        : `rgba(0, 136, 204, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Mouse interaction
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            const force = (200 - distance) / 200;
            particle.vx -= (dx / distance) * force * 0.3;
            particle.vy -= (dy / distance) * force * 0.3;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// THEME TOGGLE
// ==========================================
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// ==========================================
// TERMINAL TYPING EFFECT
// ==========================================
class TerminalTyper {
    constructor() {
        this.element = document.getElementById('typedText');
        this.texts = [
            'whoami',
            'Anuj Goyal - AI Innovation Lead',
            'cat skills.txt',
            'Building the future with AI...'
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;

        this.init();
    }

    init() {
        setTimeout(() => this.type(), 1000);
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ==========================================
// NAVIGATION SCROLL EFFECTS
// ==========================================
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');

        this.init();
    }

    init() {
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
        this.updateActiveLink();
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

// ==========================================
// 3D TILT EFFECT FOR CARDS
// ==========================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
}

// ==========================================
// FLIP CARD CLICK HANDLER
// ==========================================
class FlipCardHandler {
    constructor() {
        this.flipCards = document.querySelectorAll('.flip-card');
        this.init();
    }

    init() {
        this.flipCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.about-card, .flip-card, .project-placeholder, .social-card');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.classList.add('scroll-reveal');
        });

        this.reveal();
        window.addEventListener('scroll', () => this.reveal());
    }

    reveal() {
        this.elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }
}

// ==========================================
// SKILL TAG INTERACTIONS
// ==========================================
class SkillTagAnimations {
    constructor() {
        this.tags = document.querySelectorAll('.skill-tag');
        this.init();
    }

    init() {
        this.tags.forEach((tag, index) => {
            // Stagger animation on load
            setTimeout(() => {
                tag.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 100);

            // Random rotation on hover
            tag.addEventListener('mouseenter', () => {
                const rotation = (Math.random() - 0.5) * 10;
                tag.style.transform = `translateY(-5px) scale(1.05) rotate(${rotation}deg)`;
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        });
    }
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const particleSystem = new ParticleSystem();
    const themeManager = new ThemeManager();
    const terminalTyper = new TerminalTyper();
    const navigation = new Navigation();
    const tiltEffect = new TiltEffect();
    const flipCardHandler = new FlipCardHandler();
    const scrollReveal = new ScrollReveal();
    const skillTagAnimations = new SkillTagAnimations();

    // Resize particle canvas on window resize
    window.addEventListener('resize', () => {
        particleSystem.resize();
    });

    // Update particle canvas height on scroll
    let resizeTimeout;
    document.addEventListener('scroll', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            particleSystem.resize();
        }, 100);
    });

    console.log('🚀 Portfolio initialized successfully!');
});
