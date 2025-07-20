// wallet.js

// Shortcut function to connect wallet from external buttons
async function quickConnectWallet() {
  try {
    await connectWallet(); // This calls the main function from script.js
  } catch (e) {
    console.error("Wallet connection failed", e);
  }
}

// Optional auto-connect logic (if you enable cacheProvider: true in script.js)
window.addEventListener("load", async () => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (err) {
      console.warn("Auto-connect failed", err);
    }
  }
});
