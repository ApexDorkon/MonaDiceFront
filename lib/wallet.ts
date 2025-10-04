// lib/wallet.ts
import { ethers } from "ethers";

export interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<any>;
  on?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
}

export async function connectWallet(): Promise<{
  address: string;
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
}> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask not found");
  }
  const ethereum = (window as any).ethereum as Eip1193Provider;
  const [address] = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
  const provider = new ethers.BrowserProvider(ethereum as unknown as any);
  const signer = await provider.getSigner();
  return { address, provider, signer };
}

export function toUnits(amount: string | number, decimals = 6): bigint {
  return ethers.parseUnits(String(amount), decimals);
}

export function fromUnits(amountWei: bigint, decimals = 6): number {
  return Number(ethers.formatUnits(amountWei, decimals));
}

export function checksum(addr: string): string {
  return ethers.getAddress(addr);
}
