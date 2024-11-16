// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background-animation').appendChild(renderer.domElement);

// Create magical background elements
function createMagicalBackground() {
    // Create stars container
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    // Add stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }

    // Add comets
    setInterval(createComet, 4000);
}

function createComet() {
    const comet = document.createElement('div');
    comet.className = 'comet';
    comet.style.left = `${Math.random() * 100}%`;
    comet.style.top = `${Math.random() * 100}%`;
    document.body.appendChild(comet);

    // Remove comet after animation
    setTimeout(() => {
        comet.remove();
    }, 6000);
}

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 8;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create gradient texture for particles
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 32;
canvas.height = 32;
const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
gradient.addColorStop(0, '#ff69b4');
gradient.addColorStop(0.5, '#4169e1');
gradient.addColorStop(1, 'transparent');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 32, 32);

const particleTexture = new THREE.Texture(canvas);
particleTexture.needsUpdate = true;

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 3;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    particlesMesh.rotation.x += 0.001;
    particlesMesh.rotation.y += 0.001;

    // Mouse movement effect
    particlesMesh.rotation.x += mouseY * 0.01;
    particlesMesh.rotation.y += mouseX * 0.01;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
createMagicalBackground();
animate();

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll animation for timeline items
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});
