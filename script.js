// script.js
import { connectWallet, generateReferralLink, detectReferral, getStoredReferral } from "./wallet.js";

window.addEventListener("DOMContentLoaded", () => {
  detectReferral();
  setupListeners();
  updatePresaleStage();
});

function setupListeners() {
  document.getElementById("connectWallet")?.addEventListener("click", connectAndDisplay);
  document.getElementById("buyButton")?.addEventListener("click", buyTokens);
  document.getElementById("generateRef")?.addEventListener("click", handleReferral);
  document.getElementById("copyRef")?.addEventListener("click", copyReferral);
}

async function connectAndDisplay() {
  const { address, contract } = await connectWallet();
  document.getElementById("walletAddress").textContent = `Connected: ${address}`;
  document.getElementById("walletInfo")?.style.display = "block";

  const balance = await contract.balanceOf(address);
  document.getElementById("tokenBalance").textContent = ethers.utils.formatUnits(balance, 18);

  if (contract.claimable) {
    const claimable = await contract.claimable(address);
    document.getElementById("claimable").textContent = ethers.utils.formatUnits(claimable, 18);
  }

  const total = await contract.totalSupply();
  document.getElementById("totalSupply").textContent = ethers.utils.formatUnits(total, 18) + " $ORIF";

  const referralInput = document.getElementById("referralOutput");
  if (referralInput) referralInput.value = generateReferralLink(address);
}

async function buyTokens() {
  try {
    const bnbAmount = document.getElementById("bnbAmount").value;
    if (!bnbAmount || isNaN(bnbAmount)) {
      alert("Please enter a valid BNB amount");
      return;
    }

    const { contract } = await connectWallet();
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

function handleReferral() {
  const input = document.getElementById("referralInput").value.trim();
  if (!ethers.utils.isAddress(input)) {
    alert("Enter a valid wallet address");
    return;
  }
  const link = generateReferralLink(input);
  document.getElementById("referralOutput").value = link;
}

function copyReferral() {
  const input = document.getElementById("referralOutput");
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

function updatePresaleStage() {
  const stageLengths = 6 * 24 * 60 * 60 + 6 * 60 * 60 + 30 * 60;
  const stageStart = new Date("2025-07-23T00:00:00Z").getTime() / 1000;
  const now = Date.now() / 1000;
  const elapsed = now - stageStart;
  const stage = Math.min(Math.floor(elapsed / stageLengths) + 1, 6);

  const prices = ["0.0001", "0.0005", "0.001", "0.005", "0.009", "0.02"];
  document.getElementById("presaleStage").textContent = stage;
  document.getElementById("tokenPrice").textContent = prices[stage - 1] + " BNB";
}
