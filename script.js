// script.js
// ✅ Referral Logic
function getReferralAddress() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    localStorage.setItem("oriflame_ref", ref);
  }
}
async function updateWalletDisplay() {
  if (!signer) return;

  const address = await signer.getAddress();
  document.getElementById("walletAddress").innerText = `Connected: ${address}`;

  const balance = await contract.balanceOf(address);
  document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(balance, 18);

  // Optional vesting logic:
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
<script type="module">
import { ethers } from "https://cdn.skypack.dev/ethers@5.7.2";

// WalletConnect provider setup
import WalletConnectProvider from "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js";

// Web3Modal setup
import Web3Modal from "https://cdn.jsdelivr.net/npm/web3modal@1.9.5/dist/index.js";

// Contract Info
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const ABI = [ /* your ABI here */ ];

let provider;
let signer;
let contract;

// Connect wallet function
async function connectWallet() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/"
        },
        chainId: 56
      }
    }
  };

  const web3Modal = new Web3Modal.default({
    cacheProvider: false,
    providerOptions,
  });

  const instance = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(instance);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const address = await signer.getAddress();
  document.getElementById("userWallet").textContent = address;
  document.getElementById("walletInfo").style.display = "block";

  updateWalletDisplay();
}

// Display balance
async function updateWalletDisplay() {
  const address = await signer.getAddress();
  const balance = await contract.balanceOf(address);
  document.getElementById("userBalance").textContent = ethers.utils.formatUnits(balance, 18);
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
</script>
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
await tx.wait();
document.getElementById("buyStatus").innerText = "Success! Tokens purchased.";
updateWalletDisplay();
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
