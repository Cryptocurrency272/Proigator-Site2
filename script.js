import { connectWallet, generateReferralLink, detectReferral, getStoredReferral } from "./wallet.js";

// Run on page load
window.addEventListener("DOMContentLoaded", () => {
  detectReferral();
  setupListeners();
});

// Setup button and input events
function setupListeners() {
  document.getElementById("connectWallet").addEventListener("click", connectAndDisplay);
  document.getElementById("buyButton").addEventListener("click", buyTokens);
  document.getElementById("generateRef").addEventListener("click", handleReferral);
  document.getElementById("copyRef").addEventListener("click", copyReferral);
}

// Connect wallet & show user info
async function connectAndDisplay() {
  const { address, contract } = await connectWallet();

  document.getElementById("walletAddress").textContent = `Connected: ${address}`;
  document.getElementById("walletInfo").style.display = "block";

  const balance = await contract.balanceOf(address);
  document.getElementById("tokenBalance").textContent = ethers.utils.formatUnits(balance, 18);

  if (contract.claimable) {
    const claimable = await contract.claimable(address);
    document.getElementById("claimableAmount").textContent = ethers.utils.formatUnits(claimable, 18);
  }

  const referralInput = document.getElementById("referralOutput");
  if (referralInput) referralInput.value = generateReferralLink(address);
}

// Buy ORIF tokens with BNB
async function buyTokens() {
  try {
    const bnbAmount = document.getElementById("bnbInput").value;
    if (!bnbAmount || isNaN(bnbAmount)) {
      alert("Please enter a valid BNB amount");
      return;
    }

    const { contract, signer } = await connectWallet();
    const value = ethers.utils.parseEther(bnbAmount);
    const ref = getStoredReferral();

    const tx = await contract.buyTokens(ref, { value });
    document.getElementById("buyStatus").textContent = "Transaction sent. Waiting for confirmation...";
    await tx.wait();
    document.getElementById("buyStatus").textContent = "Success! Tokens purchased.";
  } catch (err) {
    console.error(err);
    document.getElementById("buyStatus").textContent = "Error: " + err.message;
  }
}

// Generate referral link
function handleReferral() {
  const input = document.getElementById("referralInput").value.trim();
  if (!ethers.utils.isAddress(input)) {
    alert("Enter a valid wallet address");
    return;
  }

  const link = generateReferralLink(input);
  document.getElementById("referralOutput").value = link;
}

// Copy referral link
function copyReferral() {
  const input = document.getElementById("referralOutput");
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}
