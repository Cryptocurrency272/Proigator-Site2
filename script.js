// Scroll-based animations
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

reveals.forEach(r => observer.observe(r));

// Basic referral logic (placeholder)
function copyRef() {
  const base = window.location.href.split('?')[0];
  const address = "0x123..."; // Replace with connected wallet address dynamically
  const refLink = `${base}?ref=${address}`;
  const refInput = document.getElementById('refLink');
  refInput.value = refLink;
  refInput.select();
  document.execCommand('copy');
  alert('Referral link copied!');
}
