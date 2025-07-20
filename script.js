// Referral from URL
function detectReferral() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) localStorage.setItem("oriflame_ref", ref);
}
detectReferral();

// Smooth scroll function
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Copy referral link
function copyReferral() {
  const input = document.getElementById("referralLink");
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

// Generate referral link
function generateReferralLink(address) {
  return `${window.location.origin}${window.location.pathname}?ref=${address}`;
}

// Expose functions for HTML
window.scrollToSection = scrollToSection;
window.copyReferral = copyReferral;
