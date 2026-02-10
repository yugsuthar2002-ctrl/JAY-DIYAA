/* ============================================================
   VALENTINE'S DAY WEBSITE — JAVASCRIPT
   Handles: No-button dodge, page transitions, music,
   card flip, secret surprise, confetti, floating hearts
   ============================================================ */

// ===== STATE =====
let noClickCount = 0;
let secretTapCount = 0;
let confettiRunning = false;

// ===== SWEET MESSAGES FOR "NO" CLICKS =====
const noMessages = [
    {
        emoji: '🥺',
        title: 'Are you sure?',
        text: 'My heart just cracked a little... but I believe in second chances. Maybe reconsider? I promise I\'ll make you smile every single day. 💕'
    },
    {
        emoji: '😢',
        title: 'Really, Twishu?',
        text: 'They say the best things in life are worth waiting for. I\'d wait forever for your "yes." Let me show you how much you mean to me... 🌹'
    },
    {
        emoji: '💔',
        title: 'My heart says try again...',
        text: 'Even the stars are sad right now looking at us. But you know what? I\'ll never stop trying. Because you\'re worth every attempt. ✨'
    }
];

// ===== DOM ELEMENTS =====
const btnNo = document.getElementById('btnNo');
const btnNoAgain = document.getElementById('btnNoAgain');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const envelope = document.getElementById('envelope');
const letterCard = document.getElementById('letterCard');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    setupNoDodge();
    setupNavigation();
    setupEnvelope();
    setupCursorTrail();

    // Continuously generate floating hearts
    setInterval(createFloatingHearts, 4000);
});

// ===== FLOATING HEARTS BACKGROUND =====
function createFloatingHearts() {
    const container = document.getElementById('heartsBg');
    const hearts = ['💕', '💖', '💗', '💝', '❤️', '💘', '🩷', '♥️'];
    const count = 8;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 8 + 7) + 's';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(heart);

        // Remove after animation completes
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, 16000);
    }
}

// ===== CURSOR HEART TRAIL =====
function setupCursorTrail() {
    let lastTrail = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrail < 80) return; // Throttle
        lastTrail = now;

        const trail = document.createElement('span');
        trail.className = 'cursor-heart';
        trail.textContent = ['💕', '✨', '💖', '💗'][Math.floor(Math.random() * 4)];
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);

        setTimeout(() => trail.remove(), 800);
    });
}

// ===== NO BUTTON — DODGE BEHAVIOR =====
function setupNoDodge() {
    // Landing page No button
    addDodge(btnNo);
    // Modal No button
    addDodge(btnNoAgain);
}

function addDodge(btn) {
    if (!btn) return;

    const dodge = (e) => {
        e.preventDefault();
        const maxX = window.innerWidth - btn.offsetWidth - 20;
        const maxY = window.innerHeight - btn.offsetHeight - 20;
        const newX = Math.random() * maxX;
        const newY = Math.max(100, Math.random() * maxY);

        btn.style.position = 'fixed';
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
        btn.style.zIndex = '999';
        btn.style.transition = 'all 0.15s ease-out';
    };

    btn.addEventListener('mouseover', dodge);
    btn.addEventListener('touchstart', dodge, { passive: false });

    // Allow click on No (for the 3-click flow)
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleNo();
        // Reset position
        btn.style.position = '';
        btn.style.left = '';
        btn.style.top = '';
        btn.style.zIndex = '';
    });
}

// ===== HANDLE NO CLICK =====
function handleNo() {
    noClickCount++;

    if (noClickCount <= 3) {
        const msg = noMessages[noClickCount - 1];
        document.getElementById('noEmoji').textContent = msg.emoji;
        document.getElementById('noTitle').textContent = msg.title;
        document.getElementById('noText').textContent = msg.text;
        showPage('noResponsePage');
    } else {
        showPage('finalNoPage');
    }
}

// ===== HANDLE YES CLICK =====
function handleYes() {
    // Show navbar and navigate to love letter
    navbar.classList.add('visible');
    showPage('loveLetter');
}

// ===== NEXT PAGE NAVIGATION =====
function goToNextPage(pageId) {
    if (pageId) {
        showPage(pageId);
    }
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const currentPage = document.querySelector('.page.active');
    const target = document.getElementById(pageId);

    if (!target || target === currentPage) return;

    // Add exit animation to current page
    if (currentPage) {
        currentPage.classList.remove('active');
        currentPage.classList.add('page-exit');

        // Remove exit class and reset animation after transition
        setTimeout(() => {
            currentPage.classList.remove('page-exit');
        }, 400);
    }

    // Show target page with animation
    setTimeout(() => {
        target.classList.add('active');
        // Re-trigger animation
        target.style.animation = 'none';
        target.offsetHeight; // Force reflow
        target.style.animation = '';
    }, currentPage ? 150 : 0);

    // Close mobile nav
    navLinks.classList.remove('open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== NAVBAR SETUP =====
function setupNavigation() {
    // Nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove('open');
        }
    });
}

// ===== ENVELOPE INTERACTION =====
function setupEnvelope() {
    if (!envelope || !letterCard) return;

    envelope.addEventListener('click', () => {
        envelope.classList.add('opened');
        setTimeout(() => {
            envelope.style.display = 'none';
            letterCard.classList.add('visible');
        }, 600);
    });
}

// ===== SECRET SURPRISE HEART =====
function handleSecretClick() {
    secretTapCount++;
    const counter = document.getElementById('tapCounter');
    const message = document.getElementById('secretMessage');
    const heart = document.getElementById('secretHeart');

    counter.textContent = `${Math.min(secretTapCount, 5)} / 5`;

    // Pulse effect on tap
    heart.style.transform = 'scale(1.3)';
    setTimeout(() => heart.style.transform = '', 200);

    if (secretTapCount >= 5) {
        heart.style.display = 'none';
        counter.style.display = 'none';
        message.classList.add('visible');

        // Hearts burst
        createHeartBurst();
    }
}

function createHeartBurst() {
    const burst = document.getElementById('secretBurst');
    if (!burst) return;

    for (let i = 0; i < 20; i++) {
        const h = document.createElement('span');
        h.textContent = ['💖', '💕', '✨', '💗', '❤️'][Math.floor(Math.random() * 5)];
        h.style.position = 'absolute';
        h.style.fontSize = (Math.random() * 20 + 12) + 'px';
        h.style.left = '50%';
        h.style.top = '50%';
        h.style.pointerEvents = 'none';
        h.style.animation = `burstHeart 1.2s ease-out ${i * 0.05}s forwards`;

        // Random direction
        const angle = (Math.PI * 2 * i) / 20;
        const distance = Math.random() * 120 + 60;
        h.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        h.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        burst.appendChild(h);
    }

    // Add burst animation style dynamically
    if (!document.getElementById('burstStyle')) {
        const style = document.createElement('style');
        style.id = 'burstStyle';
        style.textContent = `
            @keyframes burstHeart {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
                50% { opacity: 1; }
                100% {
                    opacity: 0;
                    transform: translate(
                        calc(-50% + var(--tx)),
                        calc(-50% + var(--ty))
                    ) scale(1.2);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== CONFETTI / HEART EXPLOSION =====
function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const proposalContent = document.getElementById('proposalContent');
    const postConfetti = document.getElementById('postConfetti');

    proposalContent.style.display = 'none';
    postConfetti.classList.add('visible');

    if (confettiRunning) return;
    confettiRunning = true;

    const particles = [];
    const colors = ['#ff69b4', '#ff1493', '#c71585', '#ffb6c1', '#ff6b9d', '#e91e63', '#f48fb1'];

    // Create particles
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.15,
            friction: 0.99,
            life: 1,
            decay: Math.random() * 0.01 + 0.005,
            isHeart: Math.random() > 0.5
        });
    }

    function drawHeart(ctx, x, y, size, color, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size / 4);
        ctx.bezierCurveTo(size / 2, -size, size, -size / 4, 0, size / 2);
        ctx.bezierCurveTo(-size, -size / 4, -size / 2, -size, 0, -size / 4);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let active = false;
        particles.forEach(p => {
            if (p.life <= 0) return;
            active = true;

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.friction;
            p.rotation += p.rotSpeed;
            p.life -= p.decay;

            ctx.globalAlpha = p.life;
            if (p.isHeart) {
                drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation);
            } else {
                ctx.fillStyle = p.color;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
            ctx.globalAlpha = 1;
        });

        if (active) {
            requestAnimationFrame(animate);
        } else {
            confettiRunning = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ===== HANDLE WINDOW RESIZE FOR CONFETTI CANVAS =====
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
