// Scroll nav effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// Referral logic
function copyReferral() {
  const url = new URL(window.location.href);
  const refCode = localStorage.getItem("oriflame_ref") || "your-wallet-address";
  url.searchParams.set("ref", refCode);
  const refLink = url.toString();
  const input = document.getElementById("refLink");
  input.value = refLink;
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

// Set referral if ?ref= is present
(function handleReferralParam() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) localStorage.setItem("oriflame_ref", ref);
})();
