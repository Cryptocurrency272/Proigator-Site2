// contract-config.js

// ✅ Contract Address — replace this with the real one if changed
export const CONTRACT_ADDRESS = "0xF4c4fA2E899B98489f399Cb521B28220076E1F88";

// ✅ ABI — standard ERC-20 ABI plus vesting + referral functions
export const ABI = [
  // ERC20 Standard
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",

  // Custom Vesting
  "function claimable(address user) view returns (uint256)",
  "function claim()",

  // Referral Buy
  "function buyTokens(address ref) payable",

  // Events (optional)
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];
