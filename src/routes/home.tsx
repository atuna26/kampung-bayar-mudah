import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/kp/Shell";
import { Send, QrCode, Download, Users, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Store, Banknote, HeartHandshake, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useStore, fmtRM } from "@/lib/kp/store";
import { TimeText } from "@/lib/kp/TimeText";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const balance = useStore(s => s.balance);
  const allTxs = useStore(s => s.txs);
  const txs = allTxs.slice(0, 4);
  const user = useStore(s => s.user);
  const [hide, setHide] = useState(false);

  return (
    <Shell>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">Welcome,</p>
          <p className="text-lg font-bold truncate">{user.name}</p>
        </div>

        <div className="rounded-3xl p-5 text-primary-foreground shadow-lg" style={{ background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.12 145))" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider opacity-90">Wallet Balance</span>
            <button onClick={()=>setHide(!hide)} aria-label="Hide balance" className="opacity-90">{hide ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
          </div>
          <p className="text-4xl font-extrabold mt-2 tracking-tight">{hide ? "RM •••••" : fmtRM(balance)}</p>
          <p className="text-xs opacity-90 mt-1">Wallet no.: 0134567890</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link to="/cashin" className="flex items-center justify-center gap-1.5 h-10 rounded-full bg-white/20 text-sm font-semibold backdrop-blur"><Banknote className="h-4 w-4"/> Top Up</Link>
            <Link to="/transactions" className="flex items-center justify-center gap-1.5 h-10 rounded-full bg-white/20 text-sm font-semibold backdrop-blur">History</Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Quick to="/send" icon={Send} label="Send" />
          <Quick to="/qr" icon={QrCode} label="Scan QR" />
          <Quick to="/receive" icon={Download} label="Receive" />
          <Quick to="/agent" icon={Users} label="Agents" />
        </div>

        <Link
          to="/guided"
          className="flex items-center gap-3 p-4 rounded-3xl border-2 border-accent shadow-sm active:bg-muted"
          style={{ background: "linear-gradient(135deg, var(--primary-soft), var(--accent))" }}
        >
          <span className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
            <HeartHandshake className="h-6 w-6 text-primary" />
          </span>
          <span className="flex-1">
            <span className="block text-base font-extrabold">Guided Mode</span>
            <span className="block text-xs text-foreground/80">Big buttons. Simple steps. Send money safely.</span>
          </span>
          <ArrowRight className="h-5 w-5 text-primary" />
        </Link>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            {txs.map(t => <TxRow key={t.id} t={t} />)}
            {txs.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No transactions yet</p>}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Quick({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card border border-border active:bg-muted">
      <span className="h-11 w-11 rounded-2xl bg-primary-soft flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </Link>
  );
}

export function TxRow({ t }: { t: any }) {
  const cfg = {
    sent: { Icon: ArrowUpRight, color: "text-destructive", sign: "-" },
    received: { Icon: ArrowDownLeft, color: "text-success", sign: "+" },
    merchant: { Icon: Store, color: "text-destructive", sign: "-" },
    cashin: { Icon: Banknote, color: "text-success", sign: "+" },
    cashout: { Icon: Banknote, color: "text-destructive", sign: "-" },
  } as const;
  const c = cfg[t.type as keyof typeof cfg];
  const statusBadge = t.status !== "completed" ? (
    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
      t.status === "pending" ? "bg-warning/30 text-warning-foreground" :
      t.status === "syncing" ? "bg-primary-soft text-primary" :
      "bg-destructive/15 text-destructive"
    }`}>{t.status === "pending" ? "Pending" : t.status === "syncing" ? "Syncing" : "Failed"}</span>
  ) : null;
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><c.Icon className={`h-5 w-5 ${c.color}`} /></span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{t.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><TimeText ts={t.ts} /> {statusBadge}</p>
      </div>
      <p className={`font-bold text-sm ${c.color}`}>{c.sign}{fmtRM(t.amount)}</p>
    </div>
  );
}
