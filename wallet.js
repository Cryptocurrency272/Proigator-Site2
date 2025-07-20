// ✅ Your deployed contract
const CONTRACT_ADDRESS = "0xF4c4fA2E899B98489f399Cb521B28220076E1F88";
const ABI = [
  // FULL ABI pasted here...
];

// Web3Modal for multi-wallet support
let provider, signer, contract;

async function connectWallet() {
  const providerOptions = {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        rpc: { 56: "https://bsc-dataseed.binance.org/" },
        chainId: 56
      }
    }
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
  document.getElementById("userWallet").innerText = address;
  document.getElementById("walletInfo").style.display = "block";
  document.getElementById("referralLink").value = generateReferralLink(address);

  await updateWalletDisplay();
}

// Buy tokens function
async function buyTokens() {
  if (!signer) await connectWallet();

  const bnb = document.getElementById("bnbAmount").value;
  if (!bnb || isNaN(bnb)) {
    alert("Enter valid BNB amount");
    return;
  }

  const value = ethers.utils.parseEther(bnb);
  const ref = localStorage.getItem("oriflame_ref") || ethers.constants.AddressZero;

  try {
    const tx = await contract.buyTokens(ref, { value });
    document.getElementById("buyStatus").innerText = "Pending transaction...";
    await tx.wait();
    document.getElementById("buyStatus").innerText = "Purchase successful!";
    await updateWalletDisplay();
  } catch (err) {
    console.error(err);
    document.getElementById("buyStatus").innerText = "Error: " + err.message;
  }
}

// Fetch account balance and vesting
async function updateWalletDisplay() {
  const addr = await signer.getAddress();
  document.getElementById("walletAddress").innerText = `Connected: ${addr}`;

  try {
    const balance = await contract.balanceOf(addr);
    document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(balance, 18);
    if (contract.claimable) {
      const claimable = await contract.claimable(addr);
      document.getElementById("claimableAmount").innerText = ethers.utils.formatUnits(claimable, 18);
    } else {
      document.getElementById("vestingStatus").style.display = "none";
    }
  } catch (e) {
    console.error("Balance error:", e);
  }
}

// Event bindings
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("bnbAmount").onkeydown = ev => {
  if (ev.key === "Enter") buyTokens();
};
