// Referral from URL
function detectReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref) {
    localStorage.setItem("oriflame_ref", ref);
  }
}
detectReferral();

// Scroll to section
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
  const base = window.location.origin + window.location.pathname;
  return `${base}?ref=${address}`;
}

// ✅ YOUR CONTRACT INFO (replace if updated)
const CONTRACT_ADDRESS = "0xF4c4fA2E899B98489f399Cb521B28220076E1F88";
const ABI = [/* trimmed here for brevity, you can paste full ABI if needed */];

// WalletConnect support
let provider, signer, contract;

async function connectWallet() {
  const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        rpc: { 56: "https://bsc-dataseed.binance.org/" },
        chainId: 56,
      },
    },
  };

  const web3Modal = new window.Web3Modal.default({
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

  const referralInput = document.getElementById("referralLink");
  if (referralInput) {
    referralInput.value = generateReferralLink(address);
  }

  updateWalletDisplay();
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);

// Buy tokens
async function buyTokens() {
  try {
    if (!signer) await connectWallet();

    const bnb = document.getElementById("bnbAmount").value;
    if (!bnb || isNaN(bnb)) {
      alert("Please enter a valid BNB amount.");
      return;
    }

    const valueInWei = ethers.utils.parseEther(bnb);
    const ref = localStorage.getItem("oriflame_ref") || ethers.constants.AddressZero;

    const tx = await contract.buyTokens(ref, { value: valueInWei });
    document.getElementById("buyStatus").innerText = "Transaction sent...";
    await tx.wait();
    document.getElementById("buyStatus").innerText = "Success! Tokens purchased.";
    updateWalletDisplay();
  } catch (err) {
    console.error(err);
    document.getElementById("buyStatus").innerText = "Error: " + err.message;
  }
}

// Wallet balance + vesting
async function updateWalletDisplay() {
  if (!signer || !contract) return;

  const address = await signer.getAddress();
  document.getElementById("walletAddress").innerText = `Connected: ${address}`;

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
    console.error("Error fetching balance/vesting:", e);
  }
}
