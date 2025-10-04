// pages/create.tsx
import { useState } from "react";
import { apiCreateCampaign } from "../lib/api";
import { getWriteContracts } from "../lib/contracts";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [symbol, setSymbol] = useState("");
  const [durationH, setDurationH] = useState(4);
  const feeBps = Number(process.env.NEXT_PUBLIC_DEFAULT_FEE_BPS || "500");

  async function handleCreate() {
    try {
      const { signer, factory } = await getWriteContracts();
      const addr = await signer.getAddress();
      const endTime = Math.floor(Date.now() / 1000) + durationH * 3600;

      const tx = await factory.createCampaign(title, symbol, endTime, feeBps);
      const receipt = await tx.wait();

      let campaignAddress: string | undefined;
      for (const log of receipt.logs) {
        try {
          const parsed = (factory as any).interface.parseLog(log);
          if (parsed.name === "CampaignDeployed") {
            campaignAddress = parsed.args.campaignAddress as string;
            break;
          }
        } catch {}
      }
      if (!campaignAddress) throw new Error("CampaignDeployed event not found");

      await apiCreateCampaign({
        creator_wallet: addr,
        contract_address: campaignAddress,
        title,
        symbol,
        end_time: new Date(endTime * 1000).toISOString(),
        fee_bps: feeBps,
        creation_stake: "0",
      });

      toast.success(`Created: ${campaignAddress}`);
      setTitle("");
      setSymbol("");
    } catch (e: any) {
      toast.error(e.message || "Create failed");
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Campaign</h1>
      <div className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="number"
          min={1}
          value={durationH}
          onChange={(e) => setDurationH(parseInt(e.target.value || "1"))}
        />
        <div className="text-sm text-gray-600">
          Ends: {dayjs().add(durationH, "hour").format("YYYY-MM-DD HH:mm")}
        </div>
        <button onClick={handleCreate} className="border rounded px-4 py-2">
          Create
        </button>
      </div>
    </main>
  );
}
