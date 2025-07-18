// script.js
// ✅ Referral Logic
function getReferralAddress() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    localStorage.setItem("oriflame_ref", ref);
  }
}

function generateReferralLink() {
  const base = window.location.origin + window.location.pathname;
  const wallet = window.ethereum?.selectedAddress || "0xYourWalletHere";
  return `${base}?ref=${wallet}`;
}

function copyReferralLink() {
  const input = document.getElementById("referralLink");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Referral link copied!");
}

// On load
window.addEventListener("DOMContentLoaded", () => {
  getReferralAddress();
  const refInput = document.getElementById("referralLink");
  if (refInput) {
    refInput.value = generateReferralLink();
  }
});

// Scroll to section utility function scrollToSection(id) { const el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } }

// Referral Logic function generateReferralLink() { const base = window.location.origin + window.location.pathname; const account = localStorage.getItem('walletAddress'); if (account) { document.getElementById('referralLink').value = ${base}?ref=${account}; } }

function copyReferral() { const input = document.getElementById('referralLink'); input.select(); document.execCommand('copy'); alert('Referral link copied!'); }

// Parse referral from URL function detectReferral() { const urlParams = new URLSearchParams(window.location.search); const ref = urlParams.get('ref'); if (ref) { localStorage.setItem('referrer', ref); } }

window.addEventListener('DOMContentLoaded', () => { detectReferral(); });
const CONTRACT_ADDRESS = "0xYourContractAddress"; // ← Replace with your real deployed contract
const ABI = [ /* your contract ABI here */ ];

let provider;
let signer;
let contract;

// Initialize connection
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    document.getElementById("buyStatus").innerText = "Wallet connected.";
  } else {
    alert("Please install MetaMask or another wallet!");
  }
}

// Buy tokens
async function buyTokens() {
  try {
    if (!signer) await connectWallet();

    const bnb = document.getElementById("bnbAmount").value;
    const valueInWei = ethers.utils.parseEther(bnb);
    
    let ref = localStorage.getItem("oriflame_ref") || ethers.constants.AddressZero;

    const tx = await contract.buyTokens(ref, { value: valueInWei });
    document.getElementById("buyStatus").innerText = "Transaction sent. Waiting for confirmation...";

    await tx.wait();
    document.getElementById("buyStatus").innerText = "Success! Tokens purchased.";
  } catch (err) {
    console.error(err);
    document.getElementById("buyStatus").innerText = "Error: " + err.message;
  }
}
async function updateWalletDisplay() {
  if (!signer) return;

  const address = await signer.getAddress();
  document.getElementById("walletAddress").innerText = `Connected: ${address}`;

  const balance = await contract.balanceOf(address);
  document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(balance, 18);

  // Optional: Vesting logic
  if (contract.claimable) {
    try {
      const claimable = await contract.claimable(address);
      document.getElementById("claimableAmount").innerText = ethers.utils.formatUnits(claimable, 18);
    } catch (e) {
      document.getElementById("vestingStatus").innerText = "Vesting info not available.";
    }
  } else {
    document.getElementById("vestingStatus").style.display = "none";
  }
}
