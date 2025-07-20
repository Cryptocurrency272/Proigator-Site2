import {
  connectWallet,
  generateReferralLink,
  detectReferral,
  getStoredReferral
} from "./wallet.js";
import { CONTRACT_ADDRESS, ABI } from "./contract-config.js";

// Run on load
window.addEventListener("DOMContentLoaded", () => {
  detectReferral();
  updatePresalePriceStage();
  setupListeners();
  fetchTotalSupply();
});

// Constants for presale stage calculation
const PRESALE_START = new Date("2025-07-23T00:00:00Z").getTime();
const STAGE_DURATION = 6 * 24 * 60 * 60 * 1000 + 6.5 * 60 * 60 * 1000; // 6d 6h 30m

const PRICE_STAGES = [
  0.0001, // Stage 1
  0.0005,
  0.001,
  0.005,
  0.009,
  0.02   // Stage 6 (listing)
];

function getCurrentPresaleStage() {
  const now = Date.now();
  const diff = now - PRESALE_START;
  const stage = Math.floor(diff / STAGE_DURATION);
  return Math.min(stage + 1, 6); // Stages: 1-6
}

function getCurrentTokenPrice() {
  return PRICE_STAGES[getCurrentPresaleStage() - 1];
}

function updatePresalePriceStage() {
  const stage = getCurrentPresaleStage();
  const price = getCurrentTokenPrice();
  document.getElementById("presaleStage").textContent = stage;
  document.getElementById("tokenPrice").textContent = `${price} BNB`;
}

function setupListeners() {
  document.getElementById("connectWallet").addEventListener("click", connectAndShow);
  document.getElementById("buyButton").addEventListener("click", buyTokens);
  document.getElementById("generateRef").addEventListener("click", handleReferral);
  document.getElementById("copyRef").addEventListener("click", copyReferral);
}

async function connectAndShow() {
  const { address, contract } = await connectWallet();

  const balance = await contract.balanceOf(address);
  document.getElementById("tokenBalance").textContent =
    `${ethers.utils.formatUnits(balance, 18)} $ORIF`;

  const claimable = await contract.claimable(address);
  document.getElementById("claimable").textContent =
    `${ethers.utils.formatUnits(claimable, 18)} $ORIF`;

  const link = generateReferralLink(address);
  document.getElementById("referralOutput").value = link;
}

async function buyTokens() {
  try {
    const bnbAmount = document.getElementById("bnbAmount").value;
    if (!bnbAmount || isNaN(bnbAmount)) {
      alert("Enter valid BNB amount");
      return;
    }

    const { contract, signer } = await connectWallet();
    const value = ethers.utils.parseEther(bnbAmount);
    const ref = getStoredReferral();

    const tx = await contract.buyTokens(ref, { value });
    document.getElementById("buyStatus").textContent = "Transaction sent...";
    await tx.wait();
    document.getElementById("buyStatus").textContent = "Tokens purchased!";
  } catch (err) {
    console.error(err);
    document.getElementById("buyStatus").textContent = "Error: " + err.message;
  }
}

function handleReferral() {
  const input = document.getElementById("referralInput").value.trim();
  if (!ethers.utils.isAddress(input)) {
    alert("Enter valid wallet address");
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

async function fetchTotalSupply() {
  const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  try {
    const supply = await contract.totalSupply();
    document.getElementById("totalSupply").textContent =
      `${ethers.utils.formatUnits(supply, 18)} $ORIF`;
  } catch (err) {
    console.error("Error loading total supply:", err);
  }
}
