/* ============================================================
   THREE.JS PARTICLE SYSTEM - OPTIMIZED
   Subtle floating sparkles in the background
   Performance optimizations for mobile devices
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
});

let particleScene, particleCamera, particleRenderer, particleAnimationId;
let particles, particleCount, particleVelocities;
let isParticleVisible = true;

// Throttle mousemove events for better performance
let mouseMoveTimeout;
const MOUSE_THROTTLE = 50;

function initParticles() {
    // Detect device capabilities
    const isMobile = window.innerWidth < 768;
    const isLowEnd = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        navigator.hardwareConcurrency <= 4;

    // Adjust particle count based on device
    particleCount = isLowEnd ? 30 : (isMobile ? 50 : 100);

    // Create scene, camera, renderer
    particleScene = new THREE.Scene();
    particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Use power preference for better performance
    particleRenderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: isLowEnd ? false : true,
        powerPreference: 'low-power'
    });

    particleRenderer.setSize(window.innerWidth, window.innerHeight);
    particleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance

    // Add canvas to body
    const container = document.createElement('div');
    container.id = 'particles-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.appendChild(particleRenderer.domElement);
    document.body.prepend(container);

    // Create particles geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
        // Random positions spread across screen
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        // Random velocities - simplified for performance
        particleVelocities.push({
            y: (Math.random() - 0.5) * 0.003,
            swaySpeed: Math.random() * 0.01 + 0.005,
            swayOffset: Math.random() * Math.PI * 2
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create material - simplified for performance
    const material = new THREE.PointsMaterial({
        color: 0xffadc6,
        size: isLowEnd ? 0.1 : 0.15,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    particleScene.add(particles);
    particleCamera.position.z = 5;

    // Throttled mouse interaction
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Visibility API - pause when tab is hidden
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animateParticles();
}

function handleMouseMove(event) {
    if (!particles) return;

    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        // Apply subtle parallax - reduced intensity for performance
        particles.rotation.y = ((event.clientX - windowHalfX) / windowHalfX) * 0.1;
        particles.rotation.x = ((event.clientY - windowHalfY) / windowHalfY) * 0.1;
    }, MOUSE_THROTTLE);
}

function handleVisibilityChange() {
    isParticleVisible = !document.hidden;
    if (!isParticleVisible) {
        cancelAnimationFrame(particleAnimationId);
    } else {
        animateParticles();
    }
}

function animateParticles() {
    if (!isParticleVisible) return;

    particleAnimationId = requestAnimationFrame(animateParticles);

    if (!particles) return;

    const time = Date.now() * 0.001;

    // Gentle rotation
    particles.rotation.y += 0.0003;

    // Individual particle movement - simplified
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        const v = particleVelocities[i];
        positions[i * 3 + 1] += Math.sin(time * v.swaySpeed + v.swayOffset) * 0.001;

        // Wrap around for continuous flow
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;
        if (positions[i * 3 + 1] < -10) positions[i * 3 + 1] = 10;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particleRenderer.render(particleScene, particleCamera);
}

// Cleanup function
function disposeParticles() {
    if (particleAnimationId) cancelAnimationFrame(particleAnimationId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('mousemove', handleMouseMove);

    if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
        particleScene.remove(particles);
    }
    if (particleRenderer) particleRenderer.dispose();
}
