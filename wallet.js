// wallet.js
import { CONTRACT_ADDRESS, ABI } from "./contract-config.js";

let provider;
let signer;
let contract;

export async function connectWallet() {
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
    providerOptions
  });

  const instance = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(instance);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const address = await signer.getAddress();
  return { provider, signer, contract, address };
}

export function generateReferralLink(address) {
  const base = window.location.origin + window.location.pathname;
  return `${base}?ref=${address}`;
}

export function detectReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref) localStorage.setItem("oriflame_ref", ref);
}

export function getStoredReferral() {
  return localStorage.getItem("oriflame_ref") || ethers.constants.AddressZero;
}

export { provider, signer, contract }; 
