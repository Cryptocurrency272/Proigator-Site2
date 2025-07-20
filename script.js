// script.js

// ---------------- Referral Logic ----------------

// Detect ?ref from URL and store in localStorage
function detectReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref) {
    localStorage.setItem("oriflame_ref", ref);
  }
}
detectReferral();

// Generate user's referral link
function generateReferralLink(address) {
  const base = window.location.origin + window.location.pathname;
  return `${base}?ref=${address}`;
}

// ---------------- Scroll & UI Helpers ----------------

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ---------------- Contract Setup ----------------

// ✅ Replace with your actual deployed values
const CONTRACT_ADDRESS = "0xF4c4fA2E899B98489f399Cb521B28220076E1F88";
const ABI = [
  "function buyTokens(address ref) public payable",
  "function balanceOf(address) view returns (uint256)",
  "function claimable(address) view returns (uint256)",
  "function claim() public"
];

let provider, signer, contract;

// ---------------- Wallet Connection ----------------

async function connectWallet() {
  const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/"
        },
        chainId: 56
      }
    }
  };

  const web3Modal = new window.Web3Modal.default({
    cacheProvider: false,
    providerOptions
  });

  const instance = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(instance);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const address = await signer.getAddress();

  // Update wallet display
  document.getElementById("userWallet").textContent = address;
  document.getElementById("walletInfo").style.display = "block";
  document.getElementById("walletAddress").textContent = `Connected: ${address}`;

  // Show referral link in input
  const referralInput = document.getElementById("referralLink");
  if (referralInput) {
    referralInput.value = generateReferralLink(address);
  }

  updateWalletDisplay();
}

// Button trigger
document.getElementById("connectWallet").addEventListener("click", connectWallet);

// ---------------- Buy Logic ----------------

async function buyTokens() {
  try {
    if (!signer) await connectWallet();

    const bnb = document.getElementById("bnbAmount").value;
    if (!bnb || isNaN(bnb)) {
      return displayStatus("buyStatus", "❌ Enter valid BNB amount.");
    }

    const valueInWei = ethers.utils.parseEther(bnb);
    const ref = localStorage.getItem("oriflame_ref") || ethers.constants.AddressZero;

    const tx = await contract.buyTokens(ref, { value: valueInWei });
    displayStatus("buyStatus", "⏳ Waiting for confirmation...");
    await tx.wait();
    displayStatus("buyStatus", "✅ Success! Tokens purchased.");
    updateWalletDisplay();
  } catch (err) {
    console.error(err);
    displayStatus("buyStatus", "❌ Error: " + (err.data?.message || err.message));
  }
}

// ---------------- Wallet Balance ----------------

async function updateWalletDisplay() {
  if (!signer || !contract) return;
  const address = await signer.getAddress();

  try {
    const balance = await contract.balanceOf(address);
    document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(balance, 18);

    if (contract.claimable) {
      const claimable = await contract.claimable(address);
      document.getElementById("claimableAmount").innerText = ethers.utils.formatUnits(claimable, 18);
    } else {
      document.getElementById("vestingStatus").style.display = "none";
    }
  } catch (e) {
    console.error("Balance/Vesting error", e);
  }
}

// ---------------- Referral Copy UI ----------------

function copyReferral() {
  const input = document.getElementById("referralLink");
  if (!input || !input.value) return;

  navigator.clipboard.writeText(input.value).then(() => {
    input.style.border = "2px solid #4caf50";
    displayStatus("referralCopiedStatus", "✅ Copied!");
    setTimeout(() => {
      input.style.border = "";
      displayStatus("referralCopiedStatus", "");
    }, 2000);
  });
}

// ---------------- Utility ----------------

function displayStatus(id, message) {
  const el = document.getElementById(id);
  if (el) el.innerText = message;
}
