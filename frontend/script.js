// ============================================
// PROFESSIONAL BACKGROUND - Code & Commerce
// Clean, Elegant, Not Distracting
// ============================================

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0, mouseY = 0;

// Professional symbols for CS & Business
const symbols = [
    '<', '>', '/', '\\', '{', '}', '(', ')', '[', ']', '=', ';',
    '//', '/*', '*/', '-->', '<-', '=>', '::', '++', '--',
    '↑', '↓', '→', '∑', 'π', 'μ', '∞', '≈', '≠', '≤', '≥',
    '%', '$', '€', '£', '¥'
];

// Color palette (professional, not flashy)
const colors = [
    'rgba(0, 212, 255, 0.15)',
    'rgba(124, 58, 237, 0.15)',
    'rgba(0, 255, 136, 0.12)',
    'rgba(255, 68, 68, 0.08)'
];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.size = Math.random() * 16 + 10;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.floatOffset = Math.random() * Math.PI * 2;
        this.floatSpeed = Math.random() * 0.01 + 0.005;
    }
    
    update() {
        this.floatOffset += this.floatSpeed;
        const floatX = Math.sin(this.floatOffset) * 0.3;
        const floatY = Math.cos(this.floatOffset * 0.7) * 0.3;
        
        this.x += this.speedX + floatX;
        this.y += this.speedY + floatY;
        
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
            const angle = Math.atan2(dy, dx);
            const force = (200 - distance) / 200 * 0.5;
            this.x += Math.cos(angle) * force;
            this.y += Math.sin(angle) * force;
        }
        
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.x < -100) this.x = canvas.width + 100;
        if (this.y > canvas.height + 100) this.y = -100;
        if (this.y < -100) this.y = canvas.height + 100;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.font = `${this.size}px "Segoe UI", "Fira Code", monospace`;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 0;
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.restore();
    }
}

class Connection {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    
    draw() {
        const distance = Math.hypot(this.p1.x - this.p2.x, this.p1.y - this.p2.y);
        if (distance < 150 && distance > 30) {
            ctx.beginPath();
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.lineTo(this.p2.x, this.p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }
}

class DataGraph {
    constructor() {
        this.x = canvas.width - 180;
        this.y = canvas.height - 100;
        this.width = 150;
        this.height = 60;
        this.dataPoints = [25, 40, 35, 55, 48, 62, 58, 70, 65, 72];
        this.time = 0;
    }
    
    update() {
        this.time += 0.005;
        for (let i = 0; i < this.dataPoints.length; i++) {
            this.dataPoints[i] += Math.sin(this.time + i * 0.5) * 0.2;
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = 0.2;
        
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        ctx.beginPath();
        const step = this.width / (this.dataPoints.length - 1);
        
        for (let i = 0; i < this.dataPoints.length; i++) {
            const x = this.x + (i * step);
            const y = this.y + this.height - (this.dataPoints[i] / 100) * this.height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        for (let i = 0; i < this.dataPoints.length; i += 2) {
            const x = this.x + (i * step);
            const y = this.y + this.height - (this.dataPoints[i] / 100) * this.height;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class NetworkNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pulse = 0;
        this.dir = 0.01;
    }
    
    update() {
        this.pulse += this.dir;
        if (this.pulse > 1 || this.pulse < 0) this.dir *= -1;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3 + this.pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, 0.2)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.fill();
        ctx.restore();
    }
}

let particlesArray = [];
let connectionsArray = [];
let networkNodesArray = [];
let dataGraph;

function init() {
    particlesArray = [];
    for (let i = 0; i < 80; i++) {
        particlesArray.push(new Particle());
    }
    
    connectionsArray = [];
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            connectionsArray.push(new Connection(particlesArray[i], particlesArray[j]));
        }
    }
    
    networkNodesArray = [];
    const spacing = 150;
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);
    
    for (let i = 1; i < cols; i++) {
        for (let j = 1; j < rows; j++) {
            if (Math.random() > 0.6) {
                networkNodesArray.push(new NetworkNode(i * spacing, j * spacing));
            }
        }
    }
    
    dataGraph = new DataGraph();
}

function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(1, '#12121a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (particlesArray) {
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
    }
    
    if (connectionsArray) {
        for (let i = 0; i < Math.min(connectionsArray.length, 300); i++) {
            if (connectionsArray[i]) connectionsArray[i].draw();
        }
    }
    
    if (networkNodesArray) {
        networkNodesArray.forEach(node => {
            node.update();
            node.draw();
        });
    }
    
    if (dataGraph) {
        dataGraph.update();
        dataGraph.draw();
    }
    
    ctx.save();
    ctx.font = '9px "Segoe UI", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillText('CODE → COMMERCE', canvas.width - 120, canvas.height - 20);
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(0, 212, 255, 0.15)';
    ctx.fillText('DATA → GROWTH', canvas.width - 115, canvas.height - 10);
    ctx.restore();
    
    requestAnimationFrame(animate);
}

// Initialize canvas and start animation
if (canvas) {
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    };
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    resizeCanvas();
    animate();
}

// ============================================
// TYPING ANIMATION
// ============================================
const typedTextSpan = document.querySelector('.typed-text');
const textArray = ['Computer Scientist', 'Business Manager', 'Web Developer', 'AI/ML Developer'];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (!typedTextSpan) return;
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (!typedTextSpan) return;
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// ============================================
// VISITOR COUNT & CONTACT FORM
// ============================================
async function getVisitorCount() {
   const BACKEND_URL = 'https://arsema-portfolio-backend.onrender.com';
    try {
        const response = await fetch(`${BACKEND_URL}/api/visitors`);
        const data = await response.json();
        const visitorElement = document.getElementById('visitor-count');
        if (visitorElement) visitorElement.textContent = data.count;
    } catch (error) {
        console.log('Backend not connected');
        const visitorElement = document.getElementById('visitor-count');
        if (visitorElement) visitorElement.textContent = '1';
    }
}

async function sendMessage(event) {
    event.preventDefault();
    
    const BACKEND_URL = 'http://localhost:3000';
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const message = document.getElementById('message')?.value;
    const formMessage = document.getElementById('form-message');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    if (!submitBtn) return;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        
        const data = await response.json();
        
        if (response.ok && formMessage) {
            formMessage.textContent = '✓ Message sent successfully! I will contact you soon.';
            formMessage.style.color = '#10b981';
            event.target.reset();
            setTimeout(() => { if (formMessage) formMessage.textContent = ''; }, 5000);
        } else if (formMessage) {
            formMessage.textContent = 'Error: ' + (data.error || 'Unknown error');
            formMessage.style.color = '#ef4444';
        }
    } catch (error) {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.textContent = '⚠️ Please email me directly at arsemabella@gmail.com';
            formMessage.style.color = '#ef4444';
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

function smoothScroll(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function downloadResume() {
    alert('📄 Please email me at arsemabella@gmail.com for my complete CV');
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
    
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => { if (loading) loading.style.display = 'none'; }, 500);
        }
    }, 1000);
    
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinks) navLinks.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    const form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', sendMessage);
    
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadResume);
    
    getVisitorCount();
});