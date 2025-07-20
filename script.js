// script.js

// Detect referral from URL and store function detectReferral() { const urlParams = new URLSearchParams(window.location.search); const ref = urlParams.get("ref"); if (ref) { localStorage.setItem("oriflame_ref", ref); } } detectReferral();

// Smooth scroll to section function scrollToSection(id) { const el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } }

// Generate referral link function generateReferralLink(address) { const base = window.location.origin + window.location.pathname; return ${base}?ref=${address}; }

// Copy logic function copyReferral() { const input = document.getElementById("referralLink"); input.select(); navigator.clipboard.writeText(input.value).then(() => { const alertBox = document.getElementById("copyAlert"); alertBox.style.opacity = 1; setTimeout(() => (alertBox.style.opacity = 0), 2000); }); }

// Contract setup const CONTRACT_ADDRESS = "0xF4c4fA2E899B98489f399Cb521B28220076E1F88"; const ABI = [ "function buyTokens(address ref) payable", "function balanceOf(address) view returns (uint256)", "function claimable(address) view returns (uint256)", "function totalSupply() view returns (uint256)" ];

let provider, signer, contract;

// Wallet connect setup async function connectWallet() { const providerOptions = { walletconnect: { package: window.WalletConnectProvider.default, options: { rpc: { 56: "https://bsc-dataseed.binance.org/" }, chainId: 56, }, }, };

const web3Modal = new window.Web3Modal.default({ cacheProvider: false, providerOptions, });

const instance = await web3Modal.connect(); provider = new ethers.providers.Web3Provider(instance); signer = provider.getSigner(); contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

const address = await signer.getAddress(); document.getElementById("userWallet").textContent = address; document.getElementById("walletInfo").style.display = "block";

const input = document.getElementById("referralLink"); input.value = generateReferralLink(address); updateWalletDisplay(); }

document.getElementById("connectWallet").addEventListener("click", connectWallet);

// Buy tokens async function buyTokens() { try { if (!signer) await connectWallet();

const bnb = document.getElementById("bnbAmount").value;
if (!bnb || isNaN(bnb)) {
  alert("Enter valid BNB amount.");
  return;
}

const value = ethers.utils.parseEther(bnb);
const ref = localStorage.getItem("oriflame_ref") || ethers.constants.AddressZero;

const tx = await contract.buyTokens(ref, { value });
document.getElementById("buyStatus").innerText = "Transaction sent...";
await tx.wait();
document.getElementById("buyStatus").innerText = "Success! Tokens bought.";
updateWalletDisplay();

} catch (e) { document.getElementById("buyStatus").innerText = "Error: " + e.message; console.error(e); } }

// Update wallet info async function updateWalletDisplay() { if (!signer || !contract) return; const address = await signer.getAddress(); document.getElementById("walletAddress").innerText = Connected: ${address};

try { const bal = await contract.balanceOf(address); document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(bal, 18);

const claimable = await contract.claimable(address);
document.getElementById("claimableAmount").innerText = ethers.utils.formatUnits(claimable, 18);

const supply = await contract.totalSupply();
document.getElementById("tokenSupply").innerText = ethers.utils.formatUnits(supply, 18) + " $ORIF";

} catch (err) { console.error("Balance or supply error", err); } }

// Manual referral link from user input function generateCustomReferral() { const custom = document.getElementById("manualRefInput").value.trim(); if (!ethers.utils.isAddress(custom)) { alert("Invalid wallet address."); return; } document.getElementById("referralLink").value = generateReferralLink(custom); }

