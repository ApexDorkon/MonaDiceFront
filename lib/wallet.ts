// lib/wallet.ts
import { ethers } from "ethers";

export async function connectWallet() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask not found");
  }
  const [address] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  return { address, provider, signer };
}

export const toUnits = (amount: string | number, decimals = 6) =>
  ethers.parseUnits(String(amount), decimals);

export const fromUnits = (amountWei: bigint, decimals = 6) =>
  Number(ethers.formatUnits(amountWei, decimals));

export function checksum(addr: string) {
  return ethers.getAddress(addr);
}
