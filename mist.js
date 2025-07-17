// mist.js const canvas = document.getElementById('mist-bg'); const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth; let height = canvas.height = window.innerHeight;

const particles = []; const totalParticles = 50;

class Particle { constructor() { this.reset(); } reset() { this.x = Math.random() * width; this.y = Math.random() * height; this.radius = 60 + Math.random() * 90; this.opacity = 0.04 + Math.random() * 0.05; this.speed = 0.2 + Math.random() * 0.3; } update() { this.x += this.speed; if (this.x - this.radius > width) { this.reset(); this.x = -this.radius; } } draw() { const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.3, this.x, this.y, this.radius); gradient.addColorStop(0, rgba(255,255,255,${this.opacity})); gradient.addColorStop(1, 'rgba(255,255,255,0)');

ctx.beginPath();
ctx.fillStyle = gradient;
ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
ctx.fill();

} }

for (let i = 0; i < totalParticles; i++) { particles.push(new Particle()); }

function animate() { ctx.clearRect(0, 0, width, height); for (const p of particles) { p.update(); p.draw(); } requestAnimationFrame(animate); }

window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });

animate();

