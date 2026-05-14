import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { TxRow } from "./home";
import { useStore, store } from "@/lib/kp/store";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/transactions")({ component: Transactions });

function Transactions() {
  const txs = useStore(s => s.txs);
  const conn = useStore(s => s.connectivity);
  const [filter, setFilter] = useState<"all"|"sent"|"received"|"merchant">("all");
  const filtered = filter==="all" ? txs : txs.filter(t => t.type===filter);
  const pendingCount = txs.filter(t => t.status==="pending").length;

  return (
    <Shell title="Transaction History">
      {pendingCount > 0 && (
        <div className="mb-3 rounded-2xl bg-warning/15 p-3 flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-warning-foreground"/>
          <p className="flex-1 text-sm"><b>{pendingCount} transactions</b> waiting to sync</p>
          <button disabled={conn==="offline"} onClick={()=>store.syncPending()} className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-50">Sync</button>
        </div>
      )}
      <div className="flex gap-2 mb-4 overflow-x-auto -mx-4 px-4 pb-1">
        {[{k:"all",l:"All"},{k:"sent",l:"Send"},{k:"received",l:"Receive"},{k:"merchant",l:"QR Payments"}].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k as any)} className={`shrink-0 px-4 h-9 rounded-full text-sm font-semibold ${filter===f.k?"bg-primary text-primary-foreground":"bg-card border border-border text-foreground"}`}>{f.l}</button>
        ))}
      </div>
      <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
        {filtered.map(t => <TxRow key={t.id} t={t}/>)}
        {filtered.length===0 && <p className="p-8 text-center text-sm text-muted-foreground">No transactions</p>}
      </div>
    </Shell>
  );
}
