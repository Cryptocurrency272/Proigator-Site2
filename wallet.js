// wallet.js

// Utility to connect wallet and expose provider/signer globally
async function initWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return { provider, signer };
  } else {
    alert("Please install MetaMask or another Web3 wallet.");
    throw new Error("Wallet not found");
  }
}
