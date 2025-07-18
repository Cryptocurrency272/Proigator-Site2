// script.js

// Scroll to section utility function scrollToSection(id) { const el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } }

// Referral Logic function generateReferralLink() { const base = window.location.origin + window.location.pathname; const account = localStorage.getItem('walletAddress'); if (account) { document.getElementById('referralLink').value = ${base}?ref=${account}; } }

function copyReferral() { const input = document.getElementById('referralLink'); input.select(); document.execCommand('copy'); alert('Referral link copied!'); }

// Parse referral from URL function detectReferral() { const urlParams = new URLSearchParams(window.location.search); const ref = urlParams.get('ref'); if (ref) { localStorage.setItem('referrer', ref); } }

window.addEventListener('DOMContentLoaded', () => { detectReferral(); });
