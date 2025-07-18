// wallet.js

let currentAccount = null;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      document.getElementById('walletDisplay').innerText = 'Connected: ' + currentAccount;
      localStorage.setItem('walletAddress', currentAccount);

      const referralInput = document.getElementById("referralLink");
      if (referralInput) {
        referralInput.value = window.location.origin + window.location.pathname + "?ref=" + currentAccount;
      }
    } catch (err) {
      alert('Wallet connection failed.');
    }
  } else {
    alert('MetaMask or compatible wallet not detected.');
  }
}

document.getElementById('connectWallet')?.addEventListener('click', connectWallet);

document.getElementById('buyToken')?.addEventListener('click', async () => {
  const amount = document.getElementById('amount').value;
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    alert('Enter a valid ETH amount.');
    return;
  }
  if (!currentAccount) {
    alert('Connect your wallet first.');
    return;
  }

  const recipient = '0xYourPresaleWalletAddress'; // 🔁 Replace this with your presale wallet
  const valueInWei = (parseFloat(amount) * 1e18).toString(16);

  try {
    const tx = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: currentAccount,
        to: recipient,
        value: '0x' + valueInWei,
        data: '0x'
      }]
    });
    alert('Transaction submitted: ' + tx);
  } catch (err) {
    alert('Transaction failed or cancelled.');
  }
});
