function scrollToReferral() {
  document.getElementById("referral").scrollIntoView({ behavior: "smooth" });
}

function copyReferral() {
  const input = document.getElementById("referralLink");
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId !== "0x38") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      }

      alert("Wallet connected!");
    } catch (err) {
      console.error(err);
      alert("Connection failed.");
    }
  } else {
    alert("Install MetaMask first!");
  }
}

function buyNow() {
  alert("Buy Now logic coming soon.");
}
