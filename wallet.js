// wallet.js
import { CONTRACT_ADDRESS, ABI } from "./contract-config.js";

let provider;
let signer;
let contract;

// Connect wallet using Web3Modal (MetaMask + WalletConnect)
export async function connectWallet() {
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
    cacheProvider: false, // prevents auto Binance Wallet default
    providerOptions
  });

  const instance = await web3Modal.connect();

  provider = new ethers.providers.Web3Provider(instance);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const address = await signer.getAddress();
  return { provider, signer, contract, address };
}

// Generate a clean referral link using current site base
export function generateReferralLink(address) {
  const base = window.location.origin + window.location.pathname;
  return `${base}?ref=${address}`;
}

// Extract referral from URL and store locally
export function detectReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref && ethers.utils.isAddress(ref)) {
    localStorage.setItem("oriflame_ref", ref);
  }
}

// Return stored referral or fallback zero address
export function getStoredReferral() {
  const stored = localStorage.getItem("oriflame_ref");
  return stored && ethers.utils.isAddress(stored)
    ? stored
    : ethers.constants.AddressZero;
}

export { provider, signer, contract };
