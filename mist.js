const canvas = document.getElementById("mist-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mistParticles = [];

for (let i = 0; i < 100; i++) {
  mistParticles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 70 + 30,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.1 + 0.02,
  });
}

function drawMist() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of mistParticles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    if (p.x > canvas.width) p.x = 0;
    if (p.y > canvas.height) p.y = 0;
    if (p.x < 0) p.x = canvas.width;
    if (p.y < 0) p.y = canvas.height;
  }
  requestAnimationFrame(drawMist);
}

drawMist();
