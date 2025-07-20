import {
  connectWallet,
  generateReferralLink,
  detectReferral,
  getStoredReferral
} from "./wallet.js";

// Run on load
window.addEventListener("DOMContentLoaded", () => {
  detectReferral();
  setupListeners();
});

// Add listeners to buttons
function setupListeners() {
  document.getElementById("connectWallet").addEventListener("click", connectAndDisplay);
  document.querySelector("#buy button").addEventListener("click", buyTokens);
  document.querySelector("#referral button:nth-of-type(1)").addEventListener("click", handleReferral);
  document.querySelector("#referral button:nth-of-type(2)").addEventListener("click", copyReferral);
  document.querySelector("#wallet button").addEventListener("click", claimTokens);
}

// Connect wallet and load data
async function connectAndDisplay() {
  try {
    const { address, contract } = await connectWallet();

    // Show user wallet
    const walletDisplay = document.getElementById("tokenBalance");
    const claimDisplay = document.getElementById("claimable");
    const supplyDisplay = document.getElementById("totalSupply");

    const balance = await contract.balanceOf(address);
    const claimable = await contract.claimable(address);
    const supply = await contract.totalSupply();

    walletDisplay.textContent = `${ethers.utils.formatUnits(balance, 18)} $ORIF`;
    claimDisplay.textContent = `${ethers.utils.formatUnits(claimable, 18)} $ORIF`;
    supplyDisplay.textContent = `${ethers.utils.formatUnits(supply, 18)} $ORIF`;

    // Referral link
    const linkInput = document.getElementById("referralLink");
    linkInput.value = generateReferralLink(address);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

// Buy tokens
async function buyTokens() {
  try {
    const amount = document.getElementById("bnbAmount").value;
    const status = document.getElementById("buyStatus");

    if (!amount || isNaN(amount)) {
      alert("Enter a valid BNB amount");
      return;
    }

    const { contract } = await connectWallet();
    const value = ethers.utils.parseEther(amount);
    const ref = getStoredReferral();

    const tx = await contract.buyTokens(ref, { value });
    status.textContent = "Transaction sent... waiting confirmation";
    await tx.wait();
    status.textContent = "✅ Purchase successful!";
  } catch (err) {
    console.error(err);
    document.getElementById("buyStatus").textContent = "❌ Error: " + err.message;
  }
}

// Claim vested tokens
async function claimTokens() {
  try {
    const { contract } = await connectWallet();
    const tx = await contract.claim();
    await tx.wait();
    alert("✅ Claimed successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Claim failed: " + err.message);
  }
}

// Generate referral from input
function handleReferral() {
  const input = document.getElementById("refInput").value.trim();
  if (!ethers.utils.isAddress(input)) {
    alert("❌ Invalid wallet address");
    return;
  }

  const link = generateReferralLink(input);
  document.getElementById("referralLink").value = link;
}

// Copy referral
function copyReferral() {
  const input = document.getElementById("referralLink");
  input.select();
  document.execCommand("copy");
  alert("✅ Referral link copied!");
}
