// Advanced UI Interactions

document.addEventListener('DOMContentLoaded', () => {
    refreshUI();
});

// Global function to refresh UI effects (e.g. after dynamic content loads)
function refreshUI(container = document) {
    initScrollAnimations(container);
    initTiltEffect(container);
    initMagneticButtons(container);

    // Singletons (run once per document)
    if (container === document) {
        // Cursor glow removed as per user request
        initParticles();
    }
}


// 1. Scroll Animations (Intersection Observer)
function initScrollAnimations(container) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const nodes = container.querySelectorAll('.card, .hero, .section-title, .grid > div');
    nodes.forEach((el) => {
        if (el.classList.contains('scroll-reveal')) return;

        el.classList.add('scroll-reveal');
        if (el.parentElement.classList.contains('grid')) {
            const childIndex = Array.from(el.parentElement.children).indexOf(el);
            el.style.transitionDelay = `${childIndex * 100}ms`;
        }
        observer.observe(el);
    });
}

// 2. 3D Tilt Effect
function initTiltEffect(container) {
    const cards = container.querySelectorAll('.card, .feature-card, .position-card');

    cards.forEach(card => {
        if (card.dataset.tiltInitialized) return;
        card.dataset.tiltInitialized = 'true';

        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

function handleTilt(e) {
    const card = e.currentTarget;
    card.style.transition = 'none';

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    let glare = card.querySelector('.glare');
    if (!glare) {
        glare = document.createElement('div');
        glare.className = 'glare';
        card.appendChild(glare);
    }

    const glareX = ((x / rect.width) * 100);
    const glareY = ((y / rect.height) * 100);

    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transition = 'var(--transition)';
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    const glare = card.querySelector('.glare');
    if (glare) glare.style.background = 'transparent';
}

// 3. Magnetic Buttons
function initMagneticButtons(container) {
    const buttons = container.querySelectorAll('.btn-primary, .btn-outline');

    buttons.forEach(btn => {
        if (btn.dataset.magneticInitialized) return;
        btn.dataset.magneticInitialized = 'true';

        btn.addEventListener('mousemove', (e) => {
            btn.style.transition = 'none';
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'var(--transition)';
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// 4. Cursor Glow Removed


// 5. Interactive Particle Network (Constellation)
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;
    const mouseDistance = 200;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(148, 163, 184, ${Math.random() * 0.5 + 0.1})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let mouse = { x: null, y: null };
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            for (let j = index; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDistance) {
                    ctx.beginPath();
                    const opacity = 1 - (distance / mouseDistance);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    if (distance > 10) {
                        p.x -= dx * 0.01;
                        p.y -= dy * 0.01;
                    }
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}
